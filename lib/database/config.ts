import Dexie from "dexie";
import { IRelatives } from "lib/types/relatives";
import { IRelationship } from "lib/types/relationship";
import { IArticle } from "lib/types/article";

export class ZisanDatabase extends Dexie {
  article!: Dexie.Table<IArticle, number>;
  relatives!: Dexie.Table<IRelatives, number>;
  relationship!: Dexie.Table<IRelationship, number>;

  constructor() {
    super("ZisanDatabase");

    //
    // Define tables and indexes
    // (Here's where the implicit table props are dynamically created)
    //
    this.version(1).stores({
      article: "++id, time, content, relativeId",
      relatives: "++id, name, other_name, email, gender, phone, origin, birthday, deathday, type, facebook",
      relationship: "id, from, to, type",
    });
  }
}

export const db = new ZisanDatabase();

