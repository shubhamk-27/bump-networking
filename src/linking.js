const config = {
    screens: {
        AddPeople: {
            path: ':username',
            parse: {
                username: (username) => `${username}`
            }
        }
    },
};

const linking = {
    prefixes: ['https://bumpme.in/', 'bump://'],
    config,
};
export default linking