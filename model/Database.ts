class Database {

	private static instance: Database | null = null;

	private db: Map<string, string>;
	
	constructor() {
		this.db = new Map();
	}

	static getInstance(): Database {
		if (!Database.instance) {
		  Database.instance = new Database();
		}
		return Database.instance;
	  }	

	get(key:string):string {
		let reVal = this.db.get(key);
		if( reVal == null) {
			return "Missing key"
		}
		return reVal
	}

	set(key:string, value:string) {
		if (this.get(key) === "Missing key"){
			this.db.set(key, value);
			return true;
		} else {
			return false;
		}
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

	listKeys() {
		
		let response = "";
		let i:number = 0;
		let lastIndex:number = this.db.size;

		this.db.forEach((value, key) => {
			response += key;
			if (i !== lastIndex - 1){
				response += ", ";
			}
			i++;
		});
		return response;
	}

}

export default Database;