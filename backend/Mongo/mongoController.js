const { ensureConnection } = require('./mongoConnector');
const Kisan = require('../Schema/kisanSchema');

/* IMPORTANT
    RDBMS       VS      MONGO
    Database            Database
    Table               Collections
    Rows                Documents
    Columns             Fields

*/
const controller = async (type, data) => {
  //Ensure MONGO Connection
  await ensureConnection();

  //All Operation in Mongo
  switch (type) {
    case 'Get': {
      // Find Request
      const posts = await Kisan.find();
      return posts;
    }
    case 'Add': {
      //Adding data
      return await data.save();
    }

    /*  case 'Patch': {
            // Updating the data
            const post = await BlogPosts.findById(data.id)
            post.title = data.title;
            const updatedPost = await post.save();
            return updatedPost;
        }
        case 'Delete' : {
            // Delete
            const post = await BlogPosts.findById(data.id)
            const deletedData = await BlogPosts.deleteOne(post)
            return deletedData;
        } */
  }
};
module.exports = { controller };
