class Database {

	private db: Map<string, string>;

	constructor() {
		this.db = new Map();
	}

	get(key:string):string {
		let reVal = this.db.get(key);
		if( reVal == null) {
			return "Missing key"
		}
		return reVal
	}

	set(key:string, value:string) {
		this.db.set(key, value);
	}

	delete(key:string) {
		this.db.delete(key);
	}

	clear() {
		this.db.clear();
	}

	has(key:string) {
		return this.db.has(key);
	}

	get size() {
		return this.db.size;
	}
}

module.exports = Database;
