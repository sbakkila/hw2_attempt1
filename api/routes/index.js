import mongoose from 'mongoose';

// pull message model off mongoose, works because Node uses singletons for imports/requires!!!
const Message = mongoose.model('Message');


export default router => {
  // get all messages
  router.get('/', (req, res, next) =>
    Message.find({}, null, { sort: '-createdDate' })
      .then(allMessages => res.json(allMessages))
      .catch(next)
  );

  // get specific message
  router.get('/message/:id', (req, res, next) =>
    Message.findById(req.params.id)
      .then(specificMessage => res.json(specificMessage))
      .catch(next)
  );

  // save a message
  router.post('/message/:messageString', (req, res, next) => {
    const newMessage = new Message({ content: req.params.messageString });
    newMessage.save()
      .then(savedMessage => res.json(savedMessage))
      .catch(next);
  });

  // update a message
  router.put('/message/:id/:newMessageString', (req, res, next) =>
    // new option here says return the updated object to the following promise
    Message.findByIdAndUpdate(req.params.id, {
      content: req.params.newMessageString,
    }, { new: true })
      .then(updatedMessage => res.status(200).json(updatedMessage))
      .catch(next)
  );

  // delete a message
  router.delete('/message/:id', (req, res, next) =>
    Message.findByIdAndRemove(req.params.id)
      .then(deletedMessage => res.status(200).json(deletedMessage))
      .catch(next)
  );

  return router;
}
