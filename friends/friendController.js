const router = require('express').Router();

const Friend = require('./friendModel');

router
  .route('/')
  .get((req, res) => {
    Friend.find({})
      .then(friends => {
        res.status(200).json(friends);
      })
      .catch(err => {
        res.status(500).json(err => {
          errorMessage: 'The friends information could not be retrieved.', err;
        });
      });
  })
  .post((req, res) => {
    const friend = new Friend(req.body);
    friend
      .save()
      .then(newFriend => {
        if (!newFriend.firstName || !newFriend.lastName || !newFriend.age) {
          res.status(400).json(err => {
            errorMessage: 'Please provide firstName, lastName and age for the friend.', err;
          });
        }
        if (NaN(newFriend.age) || newFriend.age < 1 || newFriend.age > 120) {
          res.status(400).json(err => {
            errorMessage: 'Age must be a number between 1 and 120', err;
          });
        }
        res.status(201).json(newFriend);
      })
      .catch(err => {
        res.status(500).json(err => {
          errorMessage: 'There was an error while saving the friend to the database.', err;
        });
      });
  });

router
  .route('/:id')
  .get((req, res) => {
    Friend.findById(req.params.id)
      .then(friend => {
        if (friend === null) {
          res.status(404).json(err => {
            message: 'The friend with the specified ID does not exist.', err;
          });
        }
        res.status(200).json(friend);
      })
      .catch(err => {
        res.status(500).json(err => {
          errorMessage: 'The friend information could not be retrieved.', err;
        });
      });
  })
  .delete((req, res) => {
    Friend.findByIdAndRemove(req.params.id)
      .then(friend => {
        if (friend === null) {
          res.status(404).json(err => {
            message: 'The friend with the specified ID does not exist.', err;
          });
        }
        res.status(200).json({ message: 'Friend removed.' });
      })
      .catch(err => {
        res.status(500).json(err => {
          errorMessage: 'The friend could not be removed', err;
        });
      });
  });

module.exports = router;
