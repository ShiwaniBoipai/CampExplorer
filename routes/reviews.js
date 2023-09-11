const express = require('express');
const router = express.Router({ mergeParams: true });
const catchAsync = require('../utilities/catchAsync');
const { isLoggedIn, validateReviews, isReviewAuthor } = require('../middleware');
const reviews = require('../controller/review');

router.post('/', isLoggedIn, validateReviews, catchAsync(reviews.createReview));

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview));


module.exports = router;