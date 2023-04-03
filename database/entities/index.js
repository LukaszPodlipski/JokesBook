class User {
    constructor(data){
        this.id = data.id;
        this.name = data.name;
        this.email = data.email;
        this.password = data.password;
    }
}

class Category {
    constructor(data){
        this.id = data.id;
        this.name = data?.name;
    }
}

class Joke {
    constructor(data){
        this.id = data.id;
        this.userId = data?.userId;
        this.content = data?.content;
        this.categoryId = data?.categoryId;
        this.ratings = data?.ratings || [];
    }
}

module.exports = { User, Category, Joke };