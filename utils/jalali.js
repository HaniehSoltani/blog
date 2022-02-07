const moment = require('jalali-moment');

const formatDate = (date) => {
    return moment(date).locale("fa").format("D MMM YYYY");
};