const help = async (interaction: object, params: []) => {
  console.log("help successfull")
}

const subcribe = async (interaction: object, params: []) => {
  console.log("subcribe call successfull")
}

const pendingTasks = async (interaction: object, params: []) => {
  console.log("pending tasks call successfull")
}

export { help, subcribe, pendingTasks }