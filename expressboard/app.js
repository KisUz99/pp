const express = require("express");
const handlebars = require("express-handlebars");
const mongodbConnection = require("./configs/mongodb-connection");
const app = express();
const postService = require("./services/post-service");
const { ObjectId } = require("mongodb");

const rounds = 10;

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static("static"));
app.set("view engine", "hbs");
app.engine("hbs", handlebars.create({
    helpers: require("./configs/handlebars-helpers"),
    defaultLayout: "main.hbs"
}).engine);
app.set("views", __dirname + "/views");

app.get("/", async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const search = req.query.search || "";
    try {
        const [posts, paginator] = await postService.list(collection, page, search);
        res.render("home", {title: "Express Board", search, paginator, posts});
    } catch(err) {
        console.error(err);
        res.render("home", {title: "Express Board"});
    }
});

app.get("/write", (req, res) => {
    res.render("write", { title: "Express Board" , mode: "create"});
});

app.get("/modify/:id", async (req,res) => {
    const post = await postService.getPostById(collection, req.params.id);
    console.log(post);
    res.render("write", {title: "Express Board", mode: "modify", post});
});

app.get("/detail/:id", async (req, res) => {
    const result = await postService.getDetailPost(collection, req.params.id);
    res.render("detail", {
        title: "Express Board",
        post: result.value
    });
});


app.post("/write",async (req, res) => {
    const post = req.body;
    const result = await postService.writePost(collection, post);
    res.redirect(`detail/${result.insertedId}`);
});

app.post("/modify", async (req,res) => {
    const { id, title, writer, pwd, password, content } = req.body;
    const oldPost = await collection.findOne({_id:ObjectId(id)});
    const compare = pwd === oldPost.password;
    if(compare) {
        const post = {
            title,
            writer,
            password,
            content,
            createdDt: new Date().toISOString()
        };
    
        const result = postService.updatePost(collection, id, post);
        res.json({isModified: true, id: id});
    } else {
        res.json({isModified:false});
    }
    
});

app.post("/check-password", async (req, res) => {
    const {id, password} = req.body;
    const post = await postService.getPostByIdAndPassword(collection, {id, password});
    
    if (!post) {
        return res.status(404).json({ isExist: false });
    } else {
        if((password === post.password)) {
            return res.json({ isExist: true });
        } else {
            return res.status(404).json({ isExist: false });
        }
    }
});

app.post("/write-comment", async (req, res) => {
    const { id, name, password, comment } = req.body;
    const post = await postService.getPostById(collection, id);

    if (post.comments) {
        post.comments.push({
            idx: post.comments.length + 1,
            name,
            password,
            comment,
            createdDt: new Date().toISOString()
        });
    } else {
        post.comments = [
            {
                idx: 1,
                name,
                password,
                comment,
                createdDt: new Date().toISOString()
            }
        ];
    }

    postService.updatePost(collection, id, post);
    return res.redirect(`/detail/${id}`);
});

app.delete("/delete", async (req, res) => {
    const { id, password } = req.body;
    try {
        const result = await collection.deleteOne({_id: ObjectId(id), password: password});
        if (result.deletedCount !== 1) {
            console.log("삭제 실패");
            return res.json({ isSuccess: false });
        }
        return res.json({ isSuccess: true });
    } catch(err) {
        console.error(err);
        return res.json({ isSuccess: false });
    }
    }
);

app.delete("/delete-comment", async (req, res) => {
    const { id, idx, password } = req.body;
    
    const post = await collection.findOne(
        {
            _id: ObjectId(id),
            comments: {$elemMatch: {idx: parseInt(idx), password}}
        },postService.projectionOption);
    
    if (!post) {
        return res.json({isSuccess: false});
    }

    post.comments = post.comments.filter((comment) => comment.idx != idx);
    postService.updatePost(collection, id, post);
    return res.json({isSuccess: true});
});

let collection;
app.listen(3000, async () => {
    console.log("Server started");
    const mongoClient = await mongodbConnection();
    collection = mongoClient.db().collection("post");
    console.log("MongoDB connected");
});