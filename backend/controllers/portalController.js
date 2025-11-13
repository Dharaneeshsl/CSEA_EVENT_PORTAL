// controllers/portalController.js
export const getYear1Portal = (req, res) => {
    res.status(200).json({
      message: 'Welcome to Year 1 Portal',
      user: req.user,
      subjects: ['C Programming', 'Digital Logic', 'Engineering Math I'],
    });
  };
  
  export const getYear2Portal = (req, res) => {
    res.status(200).json({
      message: 'Welcome to Year 2 Portal',
      user: req.user,
      subjects: ['Data Structures', 'OOP in Java', 'DBMS'],
    });
  };
  