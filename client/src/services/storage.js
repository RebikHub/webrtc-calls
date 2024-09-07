const set = (item) => {
  localStorage.setItem('item', JSON.stringify(item))
}

const get = () => {
  const data = localStorage.getItem('item')

  if (data) {
    return JSON.parse(data)
  }

  return null
}

export default {
  set,
  get
}