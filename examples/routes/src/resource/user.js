module.exports = {
  getUser: {
    url: '/xxx',
    method: 'get',
    mock: {
      code: 'SUCCESS',
      data: [
        {id: 1, name: 'AAA'},
        {id: 2, name: 'BBB'},
        {id: 3, name: 'CCC'},
      ]
    }
  },
  postUser: {
    url: '/sdf',
    method: 'post'
  }
}
