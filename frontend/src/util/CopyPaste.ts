function copyMainText(target:any) {
    // Get the text from the main tag
    var mainText:any = typeof target == 'string' ? target : target?.textContent;

    // Use the Clipboard API to copy the text
    if(navigator.clipboard) {
        navigator.clipboard
            .writeText(mainText)
            .then(function() {
                alert('Copy Success');
            }).catch(function(err) {
                console.error('Failed to copy text: ', err);
            });
    }else {
        fallbackCopyTextToClipboard(mainText);
    }
}

function fallbackCopyTextToClipboard(text:string) {
    var textArea = document.createElement("textarea");
    textArea.value = text;

    document.body.appendChild(textArea);
    textArea.select();
    textArea.setSelectionRange(0, 99999); // For mobile devices

    try {
        var successful = document.execCommand("copy");
        alert(successful)
    } catch (err) {
        console.error('Fallback: Oops, unable to copy', err);
    }

    document.body.removeChild(textArea);
}

export default copyMainText;