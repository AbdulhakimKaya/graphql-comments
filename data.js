const users = [
    {
        id: "1",
        fullName: "Abdulhakim KAYA"
    },
    {
        id: "2",
        fullName: "Ömer Faruk DOĞAN"
    },
    {
        id: "3",
        fullName: "Tunahan ÇELEBİ"
    },
];

const posts = [
    {
        id: "1",
        title: "Abdulhakim Post 1",
        user_id: "1",
    },
    {
        id: "2",
        title: "Abdulhakim Post 2",
        user_id: "1",
    },
    {
        id: "3",
        title: "Ömer Post 1",
        user_id: "2",
    },
    {
        id: "4",
        title: "Tunahan Post 1",
        user_id: "3",
    }
];

const comments = [
    {
        id: "1",
        text: "Ömer'in yorumu",
        post_id: "1",
        user_id: "2",
    },
    {
        id: "2",
        text: "Tunahan'ın yorumu",
        post_id: "1",
        user_id: "3",
    },
    {
        id: "3",
        text: "Abdulhakim'in yorumu",
        post_id: "2",
        user_id: "1",
    },
    {
        id: "4",
        text: "Ömer'in yorumu",
        post_id: "3",
        user_id: "2",
    },
];

module.exports = {
    users,
    posts,
    comments,
}