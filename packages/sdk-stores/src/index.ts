import { configure } from "mobx";
import { createStores } from "@kazura/react-mobx";
import { UserStore } from "./user-store";
import { MailStore } from "./mail-store";

configure({ enforceActions: "observed" });

export const stores = createStores([UserStore, MailStore]);

export * from "./user-store";
export * from "./mail-store";
