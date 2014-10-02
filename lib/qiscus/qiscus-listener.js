// Declare or get `qiscusListener` namespace.
var qiscusListener = qiscusListener || {};

// Import dependencies
var _ = _ || require('../lodash/lodash');
var qiscus = qiscus || require('./qiscus');

qiscusListener.handleRoomJoined = (function (roomJoinedData, user) {
	// Get the required data for constructing Room.
	var id = roomJoinedData.id;
	var name = roomJoinedData.name;

	// Generate all the Topics.
	var topics = _.map(roomJoinedData.listtopics, function(rawTopicData) {
		return new qiscus.Topic(rawTopicData.id, rawTopicData.title);
	});

	// Create the Room instance.
	var room = new qiscus.Room(id, name);
	// Insert all the Topics.
	_.each(topics, function(topic) {
		room.addTopic(topic);
	});

	// Insert room channel code into arbitrary property.
	// By arbitrary, it means that this value is ignored
	// by the Qiscus core module.
	room.channelCode = roomJoinedData.code_en;

	user.addRoom(room);
});

qiscusListener.handleRoomLeft = (function (roomLeftData, user) {
	var id = roomLeftData.room_id;

	user.deleteRoom(id);
});

qiscusListener.handleTopicCreated = (function (topicCreatedData, user) {
	var roomId = topicCreatedData.room_id;
	var room = user.getRoom(roomId);

	var topicId = topicCreatedData.topic_id;
	var topicTitle = topicCreatedData.title;
	var newTopic = new qiscus.Topic(topicId, topicTitle);

	room.addTopic(newTopic);
});

qiscusListener.handleTopicDeleted = (function (topicDeletedData, user) {
	var topicId = topicDeletedData.topic_id;
	var room = user.findRoomOfTopic(topicId);

	room.deleteTopic(topicId);
});

qiscusListener.handleCommentPosted = function(commentPostedData, user) {
	var topicId = commentPostedData.topic_id;
	var commentId = commentPostedData.comment_id;
	var message = commentPostedData.real_comment;
	var sender = commentPostedData.username;
	var senderEmail = commentPostedData.username_real;
	
	var room = user.findRoomOfTopic(topicId);
	var topic = room.getTopic(topicId);

	var newComment = new qiscus.Comment(commentId, message, sender, senderEmail);

	topic.addComment(newComment);
};

// Export this module for CommonJS-compatible library/environment.
if (typeof module !== 'undefined' && module.exports) {
	module.exports = qiscusListener;
}