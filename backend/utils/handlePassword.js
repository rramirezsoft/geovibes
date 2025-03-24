const bcryptjs = require('bcryptjs');

const encrypt = async (clearPassword) => {
    const hash = await bcryptjs.hash(clearPassword, 10);
    return hash;
}

const compare = async (clearPassword, hasehedPassword) => {
    const result = await bcryptjs.compare(clearPassword, hasehedPassword);
    return result;
}

module.exports = { encrypt, compare }