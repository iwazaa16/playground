// ===== submit処理の全体フロー =====

// 1. submit時のデフォルト送信を止める
// ・フォーム本来のページ遷移を防ぐ
// ・JSでバリデーション＆UI制御を行うため
// e.preventDefault()

// 2. 各入力値を取得してバリデーションを実行
// ・名前：空白を除いた文字列が存在するか
//   isValidName(name) => boolean（true: OK / false: NG）
// ・メール：メール形式として正しいか
//   isValidEmail(email) => boolean
// ・本文：空白を除いて文字が入力されているか
//   isValidMessage(message) => boolean

// 3. バリデーション結果に応じてエラー表示を制御
// ・NGの場合：
//   - input に error クラスを付与
//   - エラーメッセージを表示
//   - 以降の処理を中断する
// validateField(isValid, input, errorEl)
//   => boolean（OK: true / NG: false）
//
// ※ どれか1つでも false の場合は return で submit処理を終了

// 4. inputイベントでリアルタイムバリデーション
// ・ユーザーが入力中に条件を満たした瞬間、エラーを解除
// nameInput.addEventListener('input', () => {
//   isValidName(name) === true なら
//   clearFieldError(input, errorEl)
// })

// 5. 全項目OKの場合の送信中〜成功時UI処理
// ・送信ボタンを無効化（二重送信防止）
// ・「送信中」表示へ切り替え
// ・APIへ送信（fetch）
// ・送信成功フラグを sessionStorage に保存
// ・thanks.html へ遷移

// 6. thanks.html 側での完了ページ制御
// ・sessionStorage をチェック
// ・送信経由でなければフォームページへリダイレクト
// ・表示後はフラグを削除（直アクセス防止）



// ===== elements =====
const form = document.getElementById('contact-form');
const submitBtn = document.querySelector('.submit-btn');

// inputs
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const messageInput = document.getElementById('message');

// errors
const nameError = document.getElementById('name-error');
const emailError = document.getElementById('email-error');
const messageError = document.getElementById('message-error');

// ===== validation =====
function isValidName(name) {
  return name.trim() !== '';
}

function isValidEmail(email) {
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return pattern.test(email);
}

function isValidMessage(message) {
  return message.trim() !== '';
}


// ===== ui =====
function showError(el) {
  el.style.display = 'block';
}

function hideError(el) {
  el.style.display = 'none';
}

function validateField(isValid, input, errorEl) {
  if (!isValid) {
    setFieldError(input, errorEl);
    return false;
  }
  clearFieldError(input, errorEl);
  return true;
}

function setFieldError(input, errorEl) {
  input.classList.add('is-error');
  showError(errorEl);
}

function clearFieldError(input, errorEl) {
  input.classList.remove('is-error');
  hideError(errorEl);
}


// ===== submit =====
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const name = nameInput.value.trim();
  const email = emailInput.value.trim();
  const message = messageInput.value.trim();

  const isNameOK = validateField(
    isValidName(name),
    nameInput,
    nameError
  );

  const isEmailOK = validateField(
    isValidEmail(email),
    emailInput,
    emailError
  );

  const isMessageOK = validateField(
    isValidMessage(message),
    messageInput,
    messageError
  );

  if (!isNameOK || !isEmailOK || !isMessageOK) {
    return;
  }

  const payload = {
    name,
    email,
    message,
  };

  try {
    submitBtn.disabled = true;
    submitBtn.textContent = '送信中．．．';

    await fetch('https://jsonplaceholder.typicode.com/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    sessionStorage.setItem('isSubmitted', 'true');

    window.location.href = 'thanks.html';

  } catch (error) {
    submitBtn.disabled = false;
    submitBtn.textContent = '送信';
    alert('送信に失敗しました');
  }
});



// ===== input events =====
nameInput.addEventListener('input', () => {
  if (isValidName(nameInput.value)) {
    clearFieldError(nameInput, nameError);
  }
});

emailInput.addEventListener('input', () => {
  if (isValidEmail(emailInput.value.trim())) {
    clearFieldError(emailInput, emailError);
  }
});

messageInput.addEventListener('input', () => {
  if (isValidMessage(messageInput.value.trim())) {
    clearFieldError(messageInput, messageError);
  }
});