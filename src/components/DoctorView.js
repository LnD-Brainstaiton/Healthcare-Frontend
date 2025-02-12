import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Star,
  StarHalf,
  Calendar,
  Mail,
  Phone,
  MapPin,
  MessageCircle,
  Send,
  Clock,
  Award,
} from "lucide-react";
import { useParams } from "react-router-dom";

function DoctorView() {
  const { doctorId } = useParams();

  const [doctorDetails, setDoctorDetails] = useState(null);
  const [newComment, setNewComment] = useState("");
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [replyTo, setReplyTo] = useState(null);
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDoctorDetails = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Authentication required");

      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/api/v1/user/doctor/${doctorId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();

      if (data.responseCode === "S100000") {
        setDoctorDetails(data.data);
        setComments(data.data.ratingResponseList || []);
      } else {
        throw new Error(data.message || "Failed to fetch doctor details");
      }
    } catch (err) {
      setError(err.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const submitComment = async (parentId) => {
    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");
      if (!token) throw new Error("Authentication required");

      const payload = {
        comment: newComment,
        doctorId: doctorId,
        userId: userId,
        ...(parentId && { commentParentId: parentId }),
        ...(!parentId && { commentParentId: "parent", rating: rating }), // Only include rating for new comments, not replies
      };

      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/api/v1/user/rating`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();
      if (data.responseCode === "S100000") {
        setNewComment("");
        setRating(0);
        setReplyTo(null);
        fetchDoctorDetails();
      } else {
        throw new Error(data.message || "Failed to submit comment");
      }
    } catch (err) {
      setError(err.message || "Failed to submit comment");
    }
  };

  useEffect(() => {
    fetchDoctorDetails();
  }, [doctorId]);

  const renderStars = (rating, interactive = false) => {
    const displayRating = interactive ? hoveredRating || rating : rating;

    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            className={`${
              interactive ? "cursor-pointer" : ""
            } transition-colors duration-200`}
            onMouseEnter={() => interactive && setHoveredRating(star)}
            onMouseLeave={() => interactive && setHoveredRating(0)}
            onClick={() => interactive && setRating(star)}
            disabled={!interactive}
          >
            <Star
              className={`w-6 h-6 ${
                star <= displayRating
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-gray-300"
              }`}
            />
          </button>
        ))}
        {!interactive && (
          <span className="ml-2 text-gray-600">({rating.toFixed(1)})</span>
        )}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-teal-500 border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-600">{error}</p>
          <button
            onClick={fetchDoctorDetails}
            className="mt-4 px-6 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {doctorDetails && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Doctor Profile Card */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
              <div className="bg-gradient-to-r from-teal-500 to-teal-600 px-6 py-8 sm:p-10">
                <div className="flex flex-col sm:flex-row items-center gap-8">
                  <img
                    src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=400"
                    alt={`Dr. ${doctorDetails.firstname} ${doctorDetails.lastname}`}
                    className="w-40 h-40 rounded-full border-4 border-white shadow-lg object-cover"
                  />
                  <div className="text-center sm:text-left">
                    <h1 className="text-3xl font-bold text-white mb-2">
                      Dr. {doctorDetails.firstname} {doctorDetails.lastname}
                    </h1>
                    <p className="text-teal-50 text-lg mb-2">
                      {doctorDetails.designation}
                    </p>
                    <p className="text-teal-50 mb-4">
                      {doctorDetails.department}
                    </p>
                    <div className="bg-white/10 inline-block rounded-full px-4 py-2">
                      {renderStars(doctorDetails.rating)}
                    </div>
                  </div>
                </div>
              </div>

              <div className="px-6 py-8 sm:p-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="flex items-center gap-3">
                    <Award className="w-6 h-6 text-teal-500" />
                    <div>
                      <p className="text-sm text-gray-500">Experience</p>
                      <p className="font-semibold">
                        {doctorDetails.experience}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-6 h-6 text-teal-500" />
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-semibold">{doctorDetails.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-6 h-6 text-teal-500" />
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <p className="font-semibold">{doctorDetails.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="w-6 h-6 text-teal-500" />
                    <div>
                      <p className="text-sm text-gray-500">Location</p>
                      <p className="font-semibold">{doctorDetails.location}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Comments Section */}
            <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <MessageCircle className="w-6 h-6" />
                Patient Reviews
              </h2>

              {/* New Comment Input */}
              <div className="mb-8">
                {!replyTo && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your Rating
                    </label>
                    {renderStars(rating, true)}
                  </div>
                )}
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder={
                    replyTo ? "Write your reply..." : "Share your experience..."
                  }
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all resize-none"
                  rows={4}
                />
                <div className="mt-2 flex justify-end gap-2">
                  {replyTo && (
                    <button
                      onClick={() => {
                        setReplyTo(null);
                        setNewComment("");
                      }}
                      className="px-6 py-2 text-gray-600 hover:text-gray-800"
                    >
                      Cancel
                    </button>
                  )}
                  <button
                    onClick={() => submitComment(replyTo)}
                    disabled={!newComment.trim() || (!replyTo && rating === 0)}
                    className="flex items-center gap-2 px-6 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="w-4 h-4" />
                    {replyTo ? "Post Reply" : "Post Review"}
                  </button>
                </div>
              </div>

              {/* Comments List */}
              <div className="space-y-6">
                {comments.length > 0 ? (
                  comments.map((comment) => (
                    <motion.div
                      key={comment.commentId}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="border-b border-gray-100 pb-6"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center">
                            <span className="text-teal-600 font-semibold">
                              {comment.userId.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <p className="font-semibold text-gray-800">
                              {comment.userId}
                            </p>
                            <div className="flex items-center gap-2">
                              {renderStars(comment.rating || 0)}
                              <span className="text-sm text-gray-500 flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {new Date(
                                  comment.commentTime
                                ).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-600 ml-13">{comment.comment}</p>

                      {/* Replies */}
                      {comment.ratingReplyList &&
                        comment.ratingReplyList.length > 0 && (
                          <div className="mt-4 ml-13 space-y-4">
                            {comment.ratingReplyList.map((reply) => (
                              <div
                                key={reply.commentId}
                                className="bg-gray-50 rounded-lg p-4"
                              >
                                <div className="flex items-center gap-2 mb-2">
                                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                                    <span className="text-blue-600 font-semibold">
                                      {reply.userId.charAt(0)}
                                    </span>
                                  </div>
                                  <div>
                                    <p className="font-semibold text-gray-800">
                                      {reply.userId}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                      {new Date(
                                        reply.commentTime
                                      ).toLocaleDateString()}
                                    </p>
                                  </div>
                                </div>
                                <p className="text-gray-600 ml-10">
                                  {reply.comment}
                                </p>
                              </div>
                            ))}
                          </div>
                        )}

                      {/* Reply Button */}
                      {replyTo !== comment.commentId && (
                        <button
                          onClick={() => setReplyTo(comment.commentId)}
                          className="mt-2 text-teal-500 text-sm hover:text-teal-600 flex items-center gap-1"
                        >
                          <MessageCircle className="w-4 h-4" />
                          Reply
                        </button>
                      )}
                    </motion.div>
                  ))
                ) : (
                  <p className="text-center text-gray-500 py-8">
                    No reviews yet. Be the first to share your experience!
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default DoctorView;
