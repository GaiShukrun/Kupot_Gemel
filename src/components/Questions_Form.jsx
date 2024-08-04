import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Questions_Form.css';

const questions = [
    {
        number: 1,
        text: "מהו טווח הגיל שלך?",
        options: [
            "א. 18-25",
            "ב. 26-35",
            "ג. 36-45",
            "ד. 46-55",
            "ה. 56-65",
            "ו. מעל 65"
        ]
    },
    { // fundClassification
        number: 2,
        text: "איזה סוג קופה אתה מחפש?",
        options: [
            "כל הקופות",
            "תגמולים ואישית לפיצויים",
            "קרנות השתלמות",
            "קופת גמל להשקעה",
            "קופת גמל להשקעה - חסכון לילד",
            "מרכזית לפיצויים",
            "מטרה אחרת"
        ]
    },
    { // targetPopulation
        number: 3,
        text: "האם אתה מוגדר בתור \"עובד סקטור מסויים\"? או \"עובד מפעל/גוף מסויים\"?",
        options: [
            "לא",
            "כן, עובד סקטור מסויים",
            "כן, עובד מפעל/גוף מסויים"
        ]
    },
    { // specialization
        number: 4,
        text: "בחר את סוג ההתמחות הראשית של הקופה",
        options: [
            "אין העדפה",
            "אג\"ח",
            "הלכתי",
            "חו\"ל",
            "ישראל",
            "כללי",
            "ללא סיווג",
            "מבטיח תשואה",
            "מדד",
            "מדרגות",
            "מודל חכ\"מ אחר",
            "מניות",
            "מתמחה אחר",
            "מתמחים באפיקי השקעה סחירים",
            "מתמחים בניהול אקטיבי",
            "עוקבי מדדים",
            "קיימות",
            "שקלי"
        ]
    },
    { // subSpecialization
        number: 5,
        text: "בחר את סוג התת-התמחות של הקופה" ,
        options: [
            "אין העדפה",
            "50-60",
            "60 ומעלה",
            "אג\"ח",
            "אג\"ח ישראל",
            "אג\"ח לא צמוד",
            "אג\"ח ללא מניות",
            "אג\"ח ממשלות",
            "אג\"ח ממשלתי",
            "אג\"ח סחיר",
            "אג\"ח צמוד מדד",
            "אג\"ח צמוד מדד בינוני",
            "אג\"ח קונצרניות",
            "אוכלוסיית יעד",
            "אשראי ואג\"ח",
            "הלכה איסלאמית",
            "הלכה יהודית",
            "חו\"ל",
            "חיסכון לילד -חוסכים המעדיפים סיכון בינוני",
            "חיסכון לילד -חוסכים המעדיפים סיכון גבוה",
            "חיסכון לילד -חוסכים המעדיפים סיכון מועט",
            "טווח קצר",
            "ישראל",
            "כללי",
            "כספי (שקלי)",
            "כספית",
            "ללא מניות",
            "מבטיח תשואה",
            "מדד",
            "מדד ללא מניות",
            "ממשלתי",
            "מניות",
            "מניות ישראל",
            "מניות סחיר",
            "משולב במניות - פאסיבי",
            "משולב מניות",
            "משולב סחיר",
            "עד 10% מניות",
            "עד 50",
            "עוקב מדד s&p 500",
            "עוקבי מדד אג\"ח",
            "עוקבי מדדים - גמיש",
            "עוקבי מדדים גמיש",
            "עוקב מדדי מניות",
            "פאסיבי",
            "קיימות",
            "שקלי",
            "שקלי טווח קצר"
        ]
    },
    {
        number: 6,
        text: "האם יש לך או מתוכננות לך הוצאות גדולות בטווח הקרוב? (5-10 שנים)",
        options: [
            "א. כן",
            "ב. לא צפויות הוצאות גדולות מיוחדות"
        ]
    },
    // {
    //     number: 7,
    //     text: "דמי ניהול",
    //     options: []
    // },
    {
        number: 7,
        text: "האם הינך מייחס חשיבות לתשואת הקופה מתחילת השנה הנוכחית עד היום?",
        options: [
            "כן",
            "לא"
        ]
    },
    {
        number: 8,
        text: "האם הינך מייחס חשיבות לתשואת הקופה ב-3 השנים האחרונות?",
        options: [
            "כן",
            "לא"
        ]
    },
    {
        number: 9,
        text: "האם הינך מייחס חשיבות לתשואת הקופה ב-5 השנים האחרונות?",
        options: [
            "כן",
            "לא"
        ]
    },
    {
        number: 10,
        text: "מהי העדפתך לגבי מטבע ההשקעה?",
        options: [
            "א. השקעה בשקלים בלבד",
            "ב. חשיפה מסוימת למטבע חוץ (עד 25%)",
            "ג. חשיפה משמעותית למטבע חוץ (25%-50%)",
            "ד. רוב ההשקעה במטבע חוץ (מעל 50%)"
        ]
    },
    {
        number: 11,
        text: "האם אתה מעוניין בקופת גמל עם אפשרות להשקעה בנכסים אלטרנטיביים? (כמו נדל\"ן, הון סיכון, או קרנות גידור)",
        options: [
            "א. כן, אני מעוניין בחשיפה לנכסים אלטרנטיביים",
            "ב. לא, אני מעדיף להישאר עם נכסים מסורתיים",
            "ג. אני לא בטוח, אשמח לקבל מידע נוסף על כך"
        ]
    },
    {
        number: 12,
        text: "מהי מידת הנזילות (זמינות הכסף) שאתה מעוניין בה בהשקעותיך?",
        options: [
            "א. נזילות גבוהה מאוד - אפשרות למשיכת כספים בכל עת",
            "ב. נזילות בינונית - חלק מהכסף זמין, חלק חסום לטווח ארוך",
            "ג. נזילות נמוכה - מוכן לחסום את רוב הכסף לטווח ארוך"
        ]
    },
    {
        number: 13,
        text: "מהי העדפתך לגבי ניהול השקעות אקטיבי מול פאסיבי?",
        options: [
            "א. אני מעדיף ניהול אקטיבי עם ניסיון להשיג תשואות עודפות",
            "ב. אני מעדיף ניהול פאסיבי המחקה מדדים",
            "ג. אני מעוניין בשילוב של השניים",
            "ד. אין לי העדפה או ידע מספיק בנושא"
        ]
    },
    {
        number: 14,
        text: "האם אתה מעוניין בקופת גמל עם אפשרות למשיכה לפני גיל הפרישה?",
        options: [
            "א. כן, חשוב לי שתהיה אפשרות למשיכה מוקדמת",
            "ב. לא, אני מתכנן להשאיר את הכסף עד גיל הפרישה"
        ]
    },
    {
        number: 15,
        text: "מהי רמת הסיכון שאתה מעדיף?",
        options: [
            "א. נמוכה",
            "ב. בינונית",
            "ג. גבוהה"
        ]
    },
    {
        number: 16,
        text: "מהי העדפתך לגבי דמי ניהול?",
        options: [
            "א. מוכן לשלם דמי ניהול גבוהים יותר עבור ניהול השקעות אטרקטיבי",
            "ב. מעדיף דמי ניהול נמוכים ככל האפשר, גם אם זה אומר ניהול פאסיבי"
        ]
    },
    {
        number: 17,
        text: "מהי תקופת ההשקעה שאתה מתכנן?",
        options: [
            "א. עד שנה (קצר טווח)",
            "ב. 1-5 שנים (בינוני טווח)",
            "ג. מעל 5 שנים (ארוך טווח)"
        ]
    },
    {
        number: 18,
        text: "האם חשוב לך שההשקעה תהיה נזילה?",
        options: [
            "א. כן, חשוב",
            "ב. לא, לא חשוב"
        ]
    },
    {
        number: 19,
        text: "האם יש לך העדפות גיאוגרפיות מסוימות להשקעות?",
        options: [
            "א. בישראל",
            "ב. בחו\"ל",
            "ג. אין העדפה"
        ]
    }
  ];


const Questions_Form = () => {
    const [answers, setAnswers] = useState({});
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const username = token ? JSON.parse(atob(token.split('.')[1])).username : null;

    useEffect(() => {
        const fetchAnswers = async () => {
            try {
                setIsLoading(true);
                const response = await fetch(`http://localhost:5000/api/users/get-answers/${username}`);
                if (response.ok) {
                    const data = await response.json();
                    setAnswers(data.answers);
                    setIsEditing(true);
                }
            } catch (error) {
                console.error('Error fetching answers:', error);
            }
            setIsLoading(false);
        };

        if (username) {
            fetchAnswers();
        }
    }, [username]);


    if (isLoading) {
        return <div>Loading form...</div>;
      }


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
