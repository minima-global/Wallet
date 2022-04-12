/** Copy to clipboard */
  export async function copyTextToClipboard(text: string) {

    const queryOpts = { name: 'clipboard-read' };
  const permissionStatus = await navigator.permissions.query(queryOpts);
  // Will be 'granted', 'denied' or 'prompt':
  console.log(permissionStatus.state);

  // Listen for changes to the permission state
  permissionStatus.onchange = () => {
    console.log(permissionStatus.state);
};
    
      try {
        await navigator.clipboard.writeText(text);
        console.log('Page URL copied to clipboard');
      } catch (err) {
        console.error('Failed to copy: ', err);
      }
    
    // if ('clipboard' in navigator) { 
    //   return await navigator.clipboard.writeText(text);
    // } else {
    //   return document.execCommand('copy', true, text); // IE FALLBACK
    // }
  }
  

