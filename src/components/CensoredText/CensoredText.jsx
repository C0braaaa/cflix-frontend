import { useState } from 'react';

const BAD_WORDS = [
    // ===== TIẾNG VIỆT =====
    'đm',
    'dm',
    'đmm',
    'dcm',
    'dmm',
    'vcl',
    'vl',
    'vkl',
    'ngu',
    'ngu dốt',
    'ngu si',
    'óc chó',
    'óc heo',
    'óc lợn',
    'cứt',
    'đống cứt',
    'ăn cứt',
    'chó',
    'con chó',
    'đồ chó',
    'chó má',
    'đĩ',
    'điếm',
    'phò',
    'con điếm',
    'lồn',
    'lon',
    'cặc',
    'cak',
    'cc',
    'buồi',
    'bướm',
    'mẹ mày',
    'má mày',
    'bố mày',
    'thằng chó',
    'khốn nạn',
    'đồ khốn',
    'khốn kiếp',
    'súc vật',
    'súc sinh',
    'rác rưởi',
    'rác',
    'đồ rác',
    'biến đi',
    'cút',
    'đồ điên',
    'tâm thần',
    'đéo',
    'deo',
    'đếch',
    'đụ',
    'đụ má',
    'đụ mẹ',
    'địt',
    'dit',
    'chết tiệt',
    'bựa',
    'bệnh hoạn',
    'mất dạy',
    'vô học',
    'ăn hại',
    'phế vật',
    'đần',
    'đần độn',
    'não tàn',
    'thiểu năng',
    'thần kinh',
    'hâm',
    'dở hơi',
    'cặn bã',
    'bại não',
    'vô dụng',
    'cặn xã hội',
    'ngáo',
    'ngáo đá',
    'xàm',
    'xàm l',
    'láo',
    'láo toét',
    'láo lếu',
    'hỗn',
    'bố láo',
    'vớ vẩn',
    'tào lao',

    // ===== TIẾNG ANH =====
    'fuck',
    'fck',
    'fuk',
    'f*ck',
    'shit',
    'bitch',
    'biatch',
    'asshole',
    'bastard',
    'damn',
    'wtf',
    'stupid',
    'idiot',
    'dumb',
    'motherfucker',
    'mf',
    'dick',
    'cock',
    'pussy',
    'slut',
    'whore',
    'retard',
    'loser',
    'trash',
    'bullshit',
];
function CensoredText({ content }) {
    const [isRevealed, setIsRevealed] = useState(false);

    const checkHasBadWords = (str) => {
        return BAD_WORDS.some((word) => new RegExp(`(^|\\s)(${word})(?=\\s|$)`, 'gi').test(str));
    };

    const getCensoredText = (str) => {
        let censored = str;
        BAD_WORDS.forEach((word) => {
            const regex = new RegExp(`(^|\\s)(${word})(?=\\s|$)`, 'gi');
            censored = censored.replace(regex, (match, space, badWord) => {
                return space + '*'.repeat(badWord.length);
            });
        });
        return censored;
    };

    const hasBadWords = checkHasBadWords(content);

    if (!hasBadWords) {
        return <p>{content}</p>;
    }
    return (
        <div style={{ display: 'inline-flex', alignItems: 'center' }}>
            <p>{isRevealed ? content : getCensoredText(content)}</p>

            <span
                onClick={() => setIsRevealed(!isRevealed)}
                style={{
                    marginLeft: '8px',
                    fontSize: '1.2rem',
                    color: 'var(--primary-color)',
                    cursor: 'pointer',
                    userSelect: 'none',
                }}
            >
                {isRevealed ? '(Ẩn)' : '(Xem)'}
            </span>
        </div>
    );
}

export default CensoredText;
