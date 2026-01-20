"use client";

import React from "react";
import { DTOAccount } from "podverse-helpers";
import { ListProfileRow } from "./ListProfileRow";
import { Divider } from "../../Divider/Divider";
import styles from "../../../styles/components/List/ListNodes.module.scss";

interface Params {
  accounts: DTOAccount[];
}

export function ListProfileNodes({ accounts }: Params): React.ReactNode {
  return (
    <div key="list" className={styles.listTight}>
      {
        accounts.map((account, idx) => (
          <React.Fragment key={account.id}>
            <ListProfileRow account={account} />
            {idx < accounts.length - 1 && <Divider />}
          </React.Fragment>
        ))
      }
    </div>
  );
}
