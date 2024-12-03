const Bookmark = require('../models/Bookmark');

exports.getBookmarks = async (req, res, next) => {
    try {
        const bookmarks = await Bookmark.find({ user: req.user._id }).populate('job');
        res.status(200).json(bookmarks);
    } catch (error) {
        next(error);
    }
};

exports.createBookmark = async (req, res, next) => {
    try {
        const { jobId } = req.body;

        const bookmark = new Bookmark({
            user: req.user._id,
            job: jobId,
        });

        await bookmark.save();
        res.status(201).json(bookmark);
    } catch (error) {
        next(error);
    }
};

exports.deleteBookmark = async (req, res, next) => {
    try {
        const { id } = req.params;

        const bookmark = await Bookmark.findByIdAndDelete(id);
        if (!bookmark) {
            return res.status(404).json({ message: 'Bookmark not found' });
        }

        res.status(200).json({ message: 'Bookmark deleted successfully' });
    } catch (error) {
        next(error);
    }
};
