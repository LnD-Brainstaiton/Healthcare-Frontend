import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import profilePicture from "../assets/doctor-1.jpg";

const DoctorView = () => {
  const { doctorId } = useParams();
  const [doctorDetails, setDoctorDetails] = useState(null);
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState([]);

  // Fetch doctor details along with comments and ratings
  const fetchDoctorDetails = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        console.error("No token found");
        return;
      }
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/api/v1/user/doctor/${doctorId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      if (data.responseCode === "S100000") {
        setDoctorDetails(data.data);
        setComments(data.data.ratingResponseList || []); // Assuming `ratingResponseList` contains comments and replies
      }
    } catch (error) {
      console.error("Error fetching doctor details:", error);
    }
  };

  // Submit new comment
  const submitComment = async (parentId = null) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const payload = {
        comment: newComment,
        doctorId,
        userId: "PTf66e88", // Replace with dynamic userId
        ...(parentId && { commentParentId: parentId }),
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
        fetchDoctorDetails(); // Refresh comments and replies
      }
    } catch (error) {
      console.error("Error submitting comment:", error);
    }
  };

  useEffect(() => {
    fetchDoctorDetails();
  }, [doctorId]);

  // Render stars for rating
  const renderStars = (rating) => {
    // Ensure rating is rounded to 1 decimal place
    const roundedRating = Number(rating.toFixed(1));

    return Array(5)
      .fill(0)
      .map((_, index) => {
        if (index + 1 <= Math.floor(roundedRating)) {
          return "★"; // Full star
        } else if (
          index + 1 > Math.floor(roundedRating) &&
          index + 1 <= roundedRating
        ) {
          // Partial star based on decimal portion
          const percentage = (roundedRating % 1) * 100;
          return `<span style="position: relative">
          <span style="position: absolute; overflow: hidden; width: ${percentage}%; color: gold">★</span>
          <span style="color: gray">★</span>
        </span>`;
        } else {
          return "☆"; // Empty star
        }
      })
      .join("");
  };

  return (
    <div className="flex flex-col items-center p-6 space-y-6 bg-gray-100">
      {doctorDetails ? (
        <div className="w-full max-w-4xl bg-white rounded-lg shadow-md p-6">
          <div className="flex flex-col items-center">
            <img
              src={profilePicture}
              alt="Doctor"
              className="w-40 h-40 rounded-full mb-4"
            />
            <h1 className="text-2xl font-bold text-gray-800">
              Dr. {doctorDetails.firstname} {doctorDetails.lastname}
            </h1>
            <p className="text-lg text-gray-600">
              {doctorDetails.designation || "Designation not available"}
            </p>
            <p className="text-sm text-gray-500">
              {doctorDetails.department || "Department not available"}
            </p>
            <p className="mt-2 text-xl font-semibold text-green-600">
              {renderStars(doctorDetails.rating)} (
              {doctorDetails.rating.toFixed(1)}/5)
            </p>
          </div>
        </div>
      ) : (
        <div>Loading doctor details...</div>
      )}

      <div className="w-full max-w-4xl bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Comments</h2>
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment.commentId} className="mb-6 border-b pb-4">
              <div className="mb-2">
                <div className="flex justify-between">
                  <p className="font-semibold text-gray-700">
                    {comment.userId}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(comment.commentTime).toLocaleString()}
                  </p>
                </div>
                <p className="text-gray-800">{comment.comment}</p>
              </div>

              {/* Replies */}
              {comment.ratingReplyList &&
                comment.ratingReplyList.length > 0 && (
                  <div className="ml-4 border-l pl-4">
                    {comment.ratingReplyList.map((reply) => (
                      <div key={reply.commentId} className="mb-2">
                        <div className="flex justify-between">
                          <p className="font-semibold text-gray-600">
                            {reply.userId}
                          </p>
                          <p className="text-sm text-gray-500">
                            {new Date(reply.commentTime).toLocaleString()}
                          </p>
                        </div>
                        <p className="text-gray-700">{reply.comment}</p>
                      </div>
                    ))}
                  </div>
                )}

              {/* Add Reply */}
              <button
                onClick={() => submitComment(comment.commentId)}
                className="text-blue-500 text-sm hover:underline mt-1"
              >
                Reply
              </button>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No comments yet.</p>
        )}

        <div className="mt-4">
          <textarea
            placeholder="Write a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="w-full h-20 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          ></textarea>
          <button
            onClick={() => submitComment()}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Post Comment
          </button>
        </div>
      </div>
    </div>
  );
};

export default DoctorView;
