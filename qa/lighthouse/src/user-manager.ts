import { DataSource } from 'typeorm';
import bcrypt from 'bcryptjs';

export interface TestUser {
  email: string;
  password: string;
  accountId: number | null;
}

interface AccountRow {
  id: number;
  email: string;
  verified: boolean;
  sharable_status: number;
}

export class UserManager {
  private dataSource: DataSource | null = null;

  async initializeDatabase(): Promise<void> {
    if (this.dataSource?.isInitialized) {
      return;
    }

    const dbHost = process.env.DB_HOST || 'localhost';
    const dbPort = parseInt(process.env.DB_PORT || '5111', 10);
    const dbDatabase = process.env.DB_DATABASE || 'postgres';
    const dbUsername = process.env.DB_READ_WRITE_USERNAME || 'read_write';
    const dbPassword = process.env.DB_READ_WRITE_PASSWORD || '';

    this.dataSource = new DataSource({
      type: 'postgres',
      host: dbHost,
      port: dbPort,
      username: dbUsername,
      password: dbPassword,
      database: dbDatabase,
      synchronize: false,
      logging: false,
      entities: [],
    });

    await this.dataSource.initialize();
  }

  async closeDatabase(): Promise<void> {
    if (this.dataSource?.isInitialized) {
      await this.dataSource.destroy();
      this.dataSource = null;
    }
  }

  private async hashPassword(password: string): Promise<string> {
    // Use bcrypt to hash password (same as podverse-orm)
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    return await bcrypt.hash(password, salt);
  }

  private generateNanoId(): string {
    // Generate a 15-character nano_id_v2 compatible ID
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    let result = '';
    for (let i = 0; i < 15; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  private async findAccountByEmail(email: string): Promise<AccountRow | null> {
    if (!this.dataSource?.isInitialized) {
      throw new Error('Database not initialized');
    }

    // Use raw query to find account via account_credentials table
    const result = await this.dataSource.query(
      `SELECT a.id, a.verified, a.sharable_status_id
       FROM account a
       INNER JOIN account_credentials ac ON ac.account_id = a.id
       WHERE ac.email = $1
       LIMIT 1`,
      [email]
    );

    if (result.length === 0) {
      return null;
    }

    return {
      id: result[0].id,
      email,
      verified: result[0].verified,
      sharable_status: result[0].sharable_status_id,
    };
  }

  async createTestUser(): Promise<TestUser> {
    if (!this.dataSource?.isInitialized) {
      throw new Error('Database not initialized');
    }

    // Generate unique email for each test run
    const timestamp = Date.now();
    const randomSuffix = Math.random().toString(36).substring(2, 8);
    const email = `lighthouse-test-${timestamp}-${randomSuffix}@podverse.fm`;
    const password = 'Test!1Aa';

    // Hash password
    const hashedPassword = await this.hashPassword(password);

    // Get sharable_status id for Private (id=3 based on INSERT order: public=1, unlisted=2, private=3)
    const sharableStatusResult = await this.dataSource.query(
      `SELECT id FROM sharable_status WHERE status = 'private' LIMIT 1`
    );
    const sharableStatusId = sharableStatusResult[0]?.id || 3;

    // Generate nano_id_v2 for account
    const idText = this.generateNanoId();

    // Create account in a transaction
    await this.dataSource.transaction(async (manager) => {
      // Insert account (account table doesn't have created_at/updated_at)
      const accountResult = await manager.query(
        `INSERT INTO account (id_text, verified, sharable_status_id)
         VALUES ($1, $2, $3)
         RETURNING id`,
        [idText, true, sharableStatusId] // qaVerified = true, so verified = true
      );
      const accountId = accountResult[0].id;

      // Insert account_credentials (account_credentials doesn't have created_at/updated_at)
      await manager.query(
        `INSERT INTO account_credentials (account_id, email, password)
         VALUES ($1, $2, $3)`,
        [accountId, email, hashedPassword]
      );

      // Insert account_settings (required by database constraints)
      await manager.query(
        `INSERT INTO account_settings (account_id)
         VALUES ($1)`,
        [accountId]
      );

      // Insert account_profile (required by database constraints)
      await manager.query(
        `INSERT INTO account_profile (account_id)
         VALUES ($1)`,
        [accountId]
      );

      // Insert account_membership_status (required by database constraints)
      // Set to Trial membership (account_membership_id = 1 for Trial)
      const membershipExpires = new Date();
      membershipExpires.setMonth(membershipExpires.getMonth() + 3);
      
      await manager.query(
        `INSERT INTO account_membership_status (account_id, account_membership_id, membership_expires_at)
         VALUES ($1, 1, $2)`,
        [accountId, membershipExpires]
      );

      // Get account_settings id for locale insert
      const settingsResult = await manager.query(
        `SELECT id FROM account_settings WHERE account_id = $1`,
        [accountId]
      );
      const accountSettingsId = settingsResult[0].id;

      // Insert account_settings_locale (account_settings_locale doesn't have created_at/updated_at)
      await manager.query(
        `INSERT INTO account_settings_locale (account_settings_id, locale)
         VALUES ($1, $2)`,
        [accountSettingsId, 'en-US']
      );
    });

    // Get the created account
    const account = await this.findAccountByEmail(email);
    if (!account) {
      throw new Error(`Failed to create test user: ${email}`);
    }

    return {
      email,
      password,
      accountId: account.id,
    };
  }

  async deleteTestUser(user: TestUser): Promise<void> {
    if (!user.accountId || !this.dataSource?.isInitialized) {
      return;
    }

    try {
      // Delete in correct order (respecting foreign key constraints)
      // account_credentials references account
      await this.dataSource.query(
        `DELETE FROM account_credentials WHERE account_id = $1`,
        [user.accountId]
      );

      // account_settings_locale references account_settings
      await this.dataSource.query(
        `DELETE FROM account_settings_locale 
         WHERE account_settings_id IN (SELECT id FROM account_settings WHERE account_id = $1)`,
        [user.accountId]
      );

      // account_settings references account
      await this.dataSource.query(
        `DELETE FROM account_settings WHERE account_id = $1`,
        [user.accountId]
      );

      // account_profile references account
      await this.dataSource.query(
        `DELETE FROM account_profile WHERE account_id = $1`,
        [user.accountId]
      );

      // account_membership_status references account
      await this.dataSource.query(
        `DELETE FROM account_membership_status WHERE account_id = $1`,
        [user.accountId]
      );

      // Finally delete account
      await this.dataSource.query(
        `DELETE FROM account WHERE id = $1`,
        [user.accountId]
      );
    } catch (error) {
      console.error(`Error deleting test user ${user.email}:`, error);
      // Don't throw - continue even if deletion fails
    }
  }
}
