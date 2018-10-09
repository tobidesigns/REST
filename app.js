var bodyParser = require("body-parser"),
    methodOverride = require("method-override"),
    mongoose = require("mongoose"),
    express = require("express"),
    app = express();

//App Config
mongoose.connect("mongodb://localhost/restful_blog_app");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));

//Mongoose/model config
var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {
        type: Date,
        default: Date.now
    }
});
var Blog = mongoose.model("Blog", blogSchema)
//Redirect route page to /blogs

app.get("/", function(req, res) {
    res.redirect("/blogs");
});

//Index Page Route
app.get("/blogs", function(req, res) {
    Blog.find({}, function(err, blogs) {
        if (err) {
            console.log("error");
        } else {
            res.render("index", {
                blogs: blogs
            });
        }
    });
});

//New Route: The new route is a GET request which will show a form allowing you to enter content for a new blog post.
app.get("/blogs/new", function(req, res) {
    res.render("new");
})

//Create route
app.post("/blogs", function(req, res) {
    //Create blog
    Blog.create(req.body.blog, function(err, newBlog) {
        if (err) {
            res.render("new");
        } else {
            res.redirect("/blogs");
        }
    });
});

//Show route
app.get("/blogs/:id", function (req,res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            res.redirect("/blogs");
           } else{
                res.render("show", {blog: foundBlog});
           }
    })
})

//Edit Route
app.get("/blogs/:id/edit", function(req,res){
     Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            res.redirect("/blogs");
           } else{
                res.render("edit", {blog: foundBlog});
           }
    })
})

//Update route
app.put("/blogs/:id", function(req,res){
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
        if (err){
            res.redirect("/blogs");
        } else {
            res.redirect("/blogs/"+req.params.id);
        }
    })
})

//Delete route
app.delete("/blogs/:id", function(req,res){
    Blog.findByIdAndRemove(req.params.id, function(err){
        if (err){
            res.redirect("/blogs");
        } else {
            res.redirect("/blogs");
        }
    })
})

app.listen(process.env.PORT, process.env.IP, function() {
    console.log('server has started');
});