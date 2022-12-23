const express = require('express');
const bodyParser = require('body-parser');
const {default: axios} = require("axios")
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const posts = {};

app.get('/posts', (req, res) => {
  res.send(posts);
});

function handleEvent(type, data) {
  if (type === 'PostCreated') {
    const { id, title } = data;

    posts[id] = { id, title, comments: [] };
  }

  if (type === 'CommentCreated') {
    const { id, content, postId, status } = data;

    const post = posts[postId];
    post.comments.push({ id, content, status });
  }

  if (type === 'CommentUpdated') {
    const { id, content, postId, status } = data;

    const post = posts[postId];
    const comment = post.comments.find(comment => {
      return comment.id === id;
    });

    comment.status = status;
    comment.content = content;
  }
}

app.post('/events', (req, res) => {
  const { type, data } = req.body;

  handleEvent(type, data)

  console.log(posts);

  res.send({});
});

app.listen(4002, async () => {
  console.log('Listening on 4002');

  try {
    const events = (await axios.get("http://event-bus-srv:4005/events")).data

    for (const event of events) {
      console.log("Processing Event", event)
      handleEvent(event.type, event.data)
    }
  } catch (error) {
    console.log(error.message)
  }
  
});
