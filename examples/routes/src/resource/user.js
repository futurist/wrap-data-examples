//model.unwrap('api.user.getUser')().then(data=>console.log('data',data))
module.exports = {
  getUser: {
    url: '/xxx',
    method: 'get',
    timeout: 100,
    mock: () => new Promise((res, rej) => {
      setTimeout(() => {
        res(new Response(JSON.stringify({
          code: 'SUCCESS',
          data: [{
              id: 1,
              name: 'AAA'
            },
            {
              id: 2,
              name: 'BBB'
            },
            {
              id: 3,
              name: 'CCC'
            },
          ]
        })))
      }, 50)
    })
  },
  postUser: {
    url: '/sdf',
    method: 'post'
  }
}
