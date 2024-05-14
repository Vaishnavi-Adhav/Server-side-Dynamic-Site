function renderHeader() {
    return `
    <!DOCTYPE html>
    <html lang="en">
       <head>
          <meta charset="UTF-8">
          <meta content="width=device-width" name="viewport">
          <link rel="stylesheet" type="text/css" href="style.css">
          <title>Word Game</title>
       </head>
       <body>
          <header>
             <img alt="Website logo - Word Game" class="headerimage" src="/images/website-logo.jpg">
             <h1>Word Game</h1>
             <nav class="topnav">
                <ul class="menu">
                   <li class="menu-item"><a href="about.html">About</a></li>
                   <li class="menu-item"><a href="tournament.html">Tournament</a></li>
                   <li class="menu-item"><a href="community.html">Community</a></li>
                </ul>
             </nav>
          </header>
       `;
}

module.exports = {renderHeader};
