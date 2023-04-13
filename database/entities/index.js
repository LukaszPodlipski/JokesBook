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
    }
}

class Comment{
    constructor(data){
        this.userId = data?.userId;
        this.content = data?.content || data?.content;
        this.jokeId = data?.jokeId;
    }
}

class Rating{
    constructor(data){
        this.rate = data?.rate;
        this.jokeId = data?.jokeId;
        this.userId = data?.userId;
    }
}

module.exports = { User, Category, Joke, Comment, Rating };