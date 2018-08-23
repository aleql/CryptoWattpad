var moduleName = 'ipfs';


require([moduleName], function(){
  const node = new IPFS()
  node.on('ready', async () => {
    const version = await node.version()
    console.log('Version:', version.version)
  })
});
