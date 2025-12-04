import fs from 'fs';
import path from 'path';
import { UpdatesClient } from './UpdatesClient';

export default function UpdatesPage() {
  const changelogPath = path.join(process.cwd(), 'CHANGELOG.md');
  const changelogContent = fs.readFileSync(changelogPath, 'utf8');

  return (
    <UpdatesClient markdownContent={changelogContent} />
  );
}