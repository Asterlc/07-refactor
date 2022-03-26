const assert = require('assert');
const pwdHelper = require('../helpers/passwordHelper');

const MOCK_PWD = 'Asterlc@123456';
const MOCK_HASH = '$2b$04$Ns.v4JoS1JHq3uTT4.wCLeuDz9T8OQIM5RGnh8TbjsBI/KCA7cTHO';

describe('UserHelper test suite', function () {
    it('Deve gerar um hash a partir de uma senha', async () => {
        const result = await pwdHelper.hashPassword(MOCK_PWD);

        assert.ok(result.length > 10);
    });

    it('Deve comparar uma senha e seu hash', async () => {
        const result = pwdHelper.comparePassword(MOCK_PWD, MOCK_HASH);

        assert.ok(result)
    });
});