const header = require('./header')
const footer = require('./footer')

function renderLoginPage(isInvalid = false, errorMessage = '') {
    return `
        ${header.renderHeader()}
        <main class="login-main">
        <div class="login-content">
            <h2 class="page-title">Login</h2>
            <form method="post" action="/login">
            ${isInvalid ? '<p class="login-form-error-message">' + errorMessage + '</p>' : ''}
              <div class="login-form ${isInvalid ? "shift-position" : 'unshift-position'}">
                <label class="login-form-label" for="username-input">Enter username:</label>
                <input type="text" name="username" id="username-input" placeholder="Username">
              </div>
              <button type="submit" class="login-button">Login</button>
            </form>
        </div>
        </main>
        ${footer.renderFooter()}
      `;
}

module.exports = {renderLoginPage};
