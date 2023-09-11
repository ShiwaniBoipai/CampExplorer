const Campground = require('../Models/campground');
const { cloudinary } = require('../cloudinary');
const mpbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapboxToken = process.env.MAPBOX_TOKEN;
const geocoder = mpbxGeocoding({ accessToken: mapboxToken });

module.exports.index = async(req, res, next) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', {
        campgrounds
    });
}

module.exports.renderNewForm = (req, res) => {
    res.render('campgrounds/new');
}

module.exports.createCampground = async(req, res, next) => {
    const geoData = await geocoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send()
    const camp = new Campground(req.body.campground);
    camp.geometry = geoData.body.features[0].geometry;
    camp.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    camp.author = req.user._id;
    await camp.save();
    console.log(camp);
    req.flash('success', 'Successfully added a new Campground');
    res.redirect('/campgrounds');
}

module.exports.showCampground = async(req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    if (!campground) {
        req.flash('error', 'Cannot find the Campground!!!!');
        res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', { campground });
}
module.exports.renderEditForm = async(req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground) {
        req.flash('error', 'Cannot find the Campground');
        res.redirect('/campgrounds');
    }
    console.log(campground.images);
    res.render('campgrounds/edit', { campground });
}
module.exports.editCampground = async(req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, {...req.body.campground }, { new: true, runValidators: true });
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    campground.images.push(...imgs);
    await campground.save();
    if (req.body.deleteImgs) {
        for (let filename of req.body.deleteImgs) {
            await cloudinary.uploader.destroy(filename);
        }
        await campground.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImgs } } } });
    }
    req.flash('success', 'Updated Successfully!!!!');
    res.redirect(`/campgrounds/${campground._id}`);
}
module.exports.deleteCampground = async(req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted Campground!!!!');
    res.redirect('/campgrounds');
}