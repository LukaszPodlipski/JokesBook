class User {
    constructor(data){
        this.name = data.name;
        this.email = data.email;
        this.password = data.password;
    }
}

class Category {
    constructor(data){
        this.name = data?.name;
    }
}

class Joke {
    constructor(data){
        this.userId = data?.userId;
        this.content = data?.content;
        this.categoryId = data?.categoryId;
        this.ratings = data?.ratings || [];
    }
}

class Comment{
    constructor(data){
        this.userId = data?.userId;
        this.content = data?.content;
        this.jokeId = data?.jokeId;
    }
}

module.exports = { User, Category, Joke, Comment };