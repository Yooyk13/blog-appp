const blogModel = require("../models/blog");
const Comment = require("../models/comment");

const createBlog = async (req, res) => {
  // console.log(req.body);
  if (!req.file) {
    return res.status(400).json({ error: "Please upload a file" });
  }

  const { title, description } = req.body;
  const coverImageURL = `https://redblood.in:4000/${req.file.path}`;

  const newBlog = new blogModel({
    title,
    description,
    coverImage: coverImageURL,
    createdBy: req.userId,
  });

  try {
    await newBlog.save();
    res.status(201).json({ message: "Blog created successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getBlogs = async (req, res) => {
  try {
    const blogs = await blogModel.find().populate("createdBy");
    res.send(blogs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const findBlog = async (req, res) => {
  const id = req.params.id;
  const name = req.user;
  try {
    const blog = await blogModel.findById({ _id: id }).populate("createdBy");
    console.log("blg", blog);
    const comments = await Comment.find({ blogId: id }).populate("createdBy");
    if (!blog) {
      return res.status(404).json({ error: "Blog not found" });
    }
    res.send({ blog, comments, user: req.userId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createComment = async (req, res) => {
  console.log(req.body);
  const { content } = req.body;
  const { blogId } = req.params;
  const createdBy = req.userId;

  try {
    await Comment.create({
      content,
      blogId,
      createdBy,
    });

    res.status(201).json({ message: "Comment created successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createBlog,
  getBlogs,
  findBlog,
  createComment,
};
