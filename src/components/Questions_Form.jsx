import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Questions_Form.css';

const questions = [
    { number: 1, text: "מהו טווח הגיל שלך?", options: ["א. 18-25", "ב. 26-35", "ג. 36-45", "ד. 46-55", "ה. 56-65", "ו. מעל 65"] },
    { number: 2, text: "האם יש לך קופות גמל קיימות? אם כן, מה היתרה הכוללת בהן?", options: ["א. אין לי קופות גמל", "ב. עד 100,000 ₪", "ג. 100,000-500,000 ₪", "ד. מעל 500,000 ₪"] },
    { number: 3, text: "מהי ההשקעה המינימלית שאתה מוכן לבצע בכל חודש?", options: ["א. עד 500 ₪", "ב. 501-1,000 ₪", "ג. 1,001-2,500 ₪", "ד. 2,501-5,000 ₪", "ה. מעל 5,000 ₪"] },
    { number: 4, text: "מהי רמת ההכנסה השנתית שלך?", options: ["א. עד 150,000 ₪", "ב. 150,000-300,000 ₪", "ג. 300,000-500,000 ₪", "ד. מעל 500,000 ₪"] },
    { number: 5, text: "מהו סכום הכסף שאתה מתכוון להשקיע?", options: ["א. עד 10,000 ₪", "ב. 10,001-50,000 ₪", "ג. 50,001-100,000 ₪", "ד. 100,001-500,000 ₪", "ה. מעל 500,000 ₪"] },
    { number: 6, text: "האם יש לך או מתוכננות לך הוצאות גדולות בטווח הקרוב? (5-10 שנים)", options: ["א. כן", "ב. לא צפויות הוצאות גדולות מיוחדות"] },
    { number: 7, text: "מהי מידת החשיבות שאתה מייחס לתשואות היסטוריות של הקופה?", options: ["א. חשוב מאוד, זה השיקול העיקרי שלי", "ב. חשוב, אבל לא השיקול היחיד", "ג. פחות חשוב, אני מתמקד בגורמים אחרים"] },
    { number: 8, text: "האם אתה מעוניין בקופת גמל עם מסלול השקעה המותאם לגיל (מסלול לפי גיל)?", options: ["א. כן", "ב. לא, אני מעדיף לבחור מסלול ספציפי"] },
    { number: 9, text: "האם יש לך צורך בנגישות למידע ועדכונים שוטפים על ההשקעה שלך?", options: ["א. כן, חשוב לי לקבל עדכונים תכופים ולהיות מעורב", "ב. לא, אני מעדיף שיטה של 'השקע ושכח'"] },
    { number: 10, text: "האם יש לך העדפה לקופת גמל עם אפשרות להמרה לקצבה חודשית בעתיד?", options: ["א. כן, זה חשוב לי", "ב. לא, אני מעדיף גמישות במשיכת הכספים"] },
    { number: 11, text: "האם יש לך נכסים פיננסיים נוספים מלבד קופות גמל? (ניתן לסמן יותר מתשובה אחת)", options: ["א. תוכניות חיסכון", "ב. קרנות השתלמות", "ג. ניירות ערך (מניות/אגרות חוב)", "ד. נדל\"ן להשקעה", "ה. אין לי נכסים פיננסיים נוספים"] },
    { number: 12, text: "מהי העדפתך לגבי מטבע ההשקעה?", options: ["א. השקעה בשקלים בלבד", "ב. חשיפה מסוימת למטבע חוץ (עד 25%)", "ג. חשיפה משמעותית למטבע חוץ (25%-50%)", "ד. רוב ההשקעה במטבע חוץ (מעל 50%)"] },
    { number: 13, text: "האם אתה מעוניין בקופת גמל עם אפשרות להשקעה בנכסים אלטרנטיביים? (כמו נדל\"ן, הון סיכון, או קרנות גידור)", options: ["א. כן, אני מעוניין בחשיפה לנכסים אלטרנטיביים", "ב. לא, אני מעדיף להישאר עם נכסים מסורתיים", "ג. אני לא בטוח, אשמח לקבל מידע נוסף על כך"] },
    { number: 14, text: "מהי מידת הנזילות (זמינות הכסף) שאתה מעוניין בה בהשקעותיך?", options: ["א. נזילות גבוהה מאוד - אפשרות למשיכת כספים בכל עת", "ב. נזילות בינונית - חלק מהכסף זמין, חלק חסום לטווח ארוך", "ג. נזילות נמוכה - מוכן לחסום את רוב הכסף לטווח ארוך"] },
    { number: 15, text: "מהי העדפתך לגבי השקעות המקדמות אג'נדה חברתית או סביבתית?", options: ["א. אני מעוניין רק בהשקעות שמקדמות אג'נדה חברתית או סביבתית", "ב. אני מעדיף השקעות כאלה, אבל זה לא הקריטריון היחיד", "ג. אני מעוניין באיזון בין השקעות רגילות לבין השקעות מקדמות אג'נדה", "ד. אני לא מתחשב באג'נדה חברתית או סביבתית בהחלטות ההשקעה שלי"] },
    { number: 16, text: "מהי העדפתך לגבי ניהול השקעות אקטיבי מול פאסיבי?", options: ["א. אני מעדיף ניהול אקטיבי עם ניסיון להשיג תשואות עודפות", "ב. אני מעדיף ניהול פאסיבי המחקה מדדים", "ג. אני מעוניין בשילוב של השניים", "ד. אין לי העדפה או ידע מספיק בנושא"] },
    { number: 17, text: "האם אתה מעוניין בקופת גמל עם אפשרות למשיכה לפני גיל הפרישה?", options: ["א. כן, חשוב לי שתהיה אפשרות למשיכה מוקדמת", "ב. לא, אני מתכנן להשאיר את הכסף עד גיל הפרישה"] },
    { number: 18, text: "מהי רמת הסיכון שאתה מעדיף?", options: ["א. נמוכה", "ב. בינונית", "ג. גבוהה"] },
    { number: 19, text: "מהי העדפתך לגבי דמי ניהול?", options: ["א. מוכן לשלם דמי ניהול גבוהים יותר עבור ניהול השקעות אטרקטיבי", "ב. מעדיף דמי ניהול נמוכים ככל האפשר, גם אם זה אומר ניהול פאסיבי"] },
    { number: 20, text: "מהי תקופת ההשקעה שאתה מתכנן?", options: ["א. עד שנה (קצר טווח)", "ב. 1-5 שנים (בינוני טווח)", "ג. מעל 5 שנים (ארוך טווח)"] },
    { number: 21, text: "האם יש לך ניסיון קודם בהשקעות?", options: ["א. כן, ניסיון מועט", "ב. כן, ניסיון בינוני", "ג. כן, ניסיון רב", "ד. אין לי ניסיון"] },
    { number: 22, text: "האם אתה מעדיף השקעות עם תשואה קבועה או משתנה?", options: ["א. תשואה קבועה", "ב. תשואה משתנה", "ג. אין העדפה"] },
    { number: 23, text: "האם חשוב לך שההשקעה תהיה נזילה?", options: ["א. כן, חשוב", "ב. לא, לא חשוב"] },
    { number: 24, text: "האם יש לך העדפות גיאוגרפיות מסוימות להשקעות?", options: ["א. בישראל", "ב. בחו\"ל", "ג. אין העדפה"] }
];


const Questions_Form = () => {
    const [answers, setAnswers] = useState({});
    const [isEditing, setIsEditing] = useState(false);
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const username = token ? JSON.parse(atob(token.split('.')[1])).username : null; // Assuming JWT structure

    useEffect(() => {
        const fetchAnswers = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/users/answers/${username}`);
                if (response.ok) {
                    const data = await response.json();
                    setAnswers(data.answers);
                    setIsEditing(true);
                }
            } catch (error) {
                console.error('Error fetching answers:', error);
            }
        };

        if (username) {
            fetchAnswers();
        }
    }, [username]);

    const handleChange = (questionNumber, value) => {
        setAnswers(prevAnswers => ({
            ...prevAnswers,
            [questionNumber]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const url = `http://localhost:5000/api/users/answers/${username}`;
        const method = isEditing ? 'PUT' : 'POST';

        console.log('Submitting answers:', { username, answers });

        try {
            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, answers })
            });

            const responseData = await response.json();
            console.log('Response data:', responseData);

            if (response.ok) {
                alert('Answers saved successfully');
                navigate('/');
            } else {
                alert(`Error saving answers: ${responseData.message}`);
            }
        } catch (error) {
            console.error('Error saving answers:', error);
            alert('An error occurred while saving answers');
        }
    };

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete your answers?')) {
            try {
                const response = await fetch(`http://localhost:5000/api/users/answers/${username}`, {
                    method: 'DELETE'
                });

                const responseData = await response.json();
                console.log('Response data:', responseData);

                if (response.ok) {
                    alert('Answers deleted successfully');
                    setAnswers({});
                    setIsEditing(false);
                    navigate('/');
                } else {
                    alert(`Error deleting answers: ${responseData.message}`);
                }
            } catch (error) {
                console.error('Error deleting answers:', error);
                alert('An error occurred while deleting answers');
            }
        }
    };

    return (
        <div className="questions-form-container">
            <h2>Investment Preferences Questionnaire</h2>
            <form onSubmit={handleSubmit}>
                {questions.map((question, index) => (
                    <div key={index} className="question-item">
                        <label>{question.text}</label>
                        <select value={answers[question.number] || ''} onChange={(e) => handleChange(question.number, e.target.value)} required>
                            <option value="">Select an option</option>
                            {question.options.map((option, idx) => (
                                <option key={idx} value={option}>{option}</option>
                            ))}
                        </select>
                    </div>
                ))}
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <button type="submit" className={isEditing ? 'update-button' : 'save-button'} style={{ backgroundColor: isEditing ? '#ffc107' : '#28a745', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                        {isEditing ? 'Update' : 'Save'}
                    </button>
                    {isEditing && (
                        <button type="button" onClick={handleDelete} style={{ backgroundColor: '#dc3545', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                            Delete
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
};

export default Questions_Form;
