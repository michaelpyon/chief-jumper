import { titleForLevel } from '../data/constants.js';

const SHARE_URL = 'https://chief-jumper.vercel.app';

export class ShareCard {
    constructor() {
        this.el = document.getElementById('share-card');
        this.lineEl = document.getElementById('share-card-line');
        this.copyBtn = document.getElementById('share-copy-btn');
        this.tweetBtn = document.getElementById('share-tweet-btn');
        this.shareText = '';
        this.visible = false;

        if (this.copyBtn) {
            this._bind(this.copyBtn, () => this._copy());
        }
        if (this.tweetBtn) {
            this._bind(this.tweetBtn, () => this._tweet());
        }
    }

    // Stop game canvas restart handlers from firing when a button is tapped.
    _bind(btn, handler) {
        const run = (e) => {
            e.stopPropagation();
            handler();
        };
        btn.addEventListener('click', run);
        btn.addEventListener('touchstart', (e) => {
            e.stopPropagation();
            e.preventDefault();
            handler();
        }, { passive: false });
        btn.addEventListener('mousedown', (e) => e.stopPropagation());
    }

    buildText(score, level) {
        const title = titleForLevel(level);
        return `I made ${title} with a score of ${score} before getting laid off in Chief Jumper. Can you climb higher?`;
    }

    show(score, level) {
        if (!this.el) return;
        this.shareText = this.buildText(score, level);
        if (this.lineEl) {
            this.lineEl.textContent = this.shareText;
        }
        if (this.copyBtn) {
            this.copyBtn.textContent = 'Copy result';
        }
        this.el.classList.remove('hidden');
        this.visible = true;
    }

    hide() {
        if (!this.el) return;
        this.el.classList.add('hidden');
        this.visible = false;
    }

    _copy() {
        const text = `${this.shareText} ${SHARE_URL}`;
        const done = () => { if (this.copyBtn) this.copyBtn.textContent = 'Copied!'; };
        const fail = () => { if (this.copyBtn) this.copyBtn.textContent = 'Copy failed'; };
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text).then(done).catch(fail);
        } else {
            fail();
        }
    }

    _tweet() {
        const url = 'https://twitter.com/intent/tweet?text=' +
            encodeURIComponent(this.shareText) +
            '&url=' + encodeURIComponent(SHARE_URL);
        window.open(url, '_blank', 'noopener,noreferrer');
    }
}
