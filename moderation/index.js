const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());

app.post('/events', async (req, res) => {
  const { type, data } = req.body;

  if (type === 'CommentCreated') {
    // Let's assume we need to perform cpu intensive task
    setTimeout(async () => {
      const status = data.content.includes('orange') ? 'rejected' : 'approved';

      await axios.post('http://event-bus-srv:4005/events', {
        type: 'CommentModerated',
        data: {
          id: data.id,
          postId: data.postId,
          status,
          content: data.content
        }
      });

      return res.json({})
    }, 10000)
  }
});

app.listen(4003, () => {
  console.log('Listening on 4003');
});
