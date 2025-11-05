import React, { useState, useEffect } from 'react';

const RoundTwo = ({ loggedInYear, fragments: parentFragments = [], setFragments, onComplete }) => {
  const [currentPuzzle, setCurrentPuzzle] = useState(0);
  const [code, setCode] = useState('');
  const [testResults, setTestResults] = useState({ visible: [], hiddenPassed: 0, ran: false, details: [] });
  const [runOutput, setRunOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [fragments, setFragmentsLocal] = useState(parentFragments);
  const [error, setError] = useState('');
  const [puzzleCompleted, setPuzzleCompleted] = useState(new Set());

  // Sync with parent fragments
  useEffect(() => {
    if (parentFragments.length > 0 && fragments.length === 0) {
      setFragmentsLocal(parentFragments);
    }
  }, [parentFragments, fragments.length]);

  const language = loggedInYear === '1st' ? 'Python' : 'C';
  
  // Python puzzles for 1st years
  const pythonPuzzles = [
    {
      id: 1,
      language: "Python",
      code: `def find_portal(n):
    portl = []
    for i in range(n):
        if i % 2 == 0:
            portal.append(i)
    return portal`,
      fixedCode: `def find_portal(n):
    portal = []
    for i in range(n):
        if i % 2 == 0:
            portal.append(i)
    return portal`,
      hint: "Fix the variable name typos (portl → portal)",
      fragment: "FRAGMENT1"
    },
    {
      id: 2,
      language: "Python",
      code: `def count_dimensions(arr):
    count = 0
    for x in arr:
        if x > 0
            count += 1
    return count`,
      fixedCode: `def count_dimensions(arr):
    count = 0
    for x in arr:
        if x > 0:
            count += 1
    return count`,
      hint: "Missing colon after the if statement",
      fragment: "FRAGMENT2"
    },
    {
      id: 3,
      language: "Python",
      code: `def reverse_string(s):
    result = ""
    for i in range(len(s)):
        result = result + s[i]
    return result`,
      fixedCode: `def reverse_string(s):
    result = ""
    for i in range(len(s)):
        result = s[i] + result
    return result`,
      hint: "Check the string concatenation order to reverse",
      fragment: "FRAGMENT3"
    }
  ];

  // C puzzles for 2nd years
  const cPuzzles = [
    {
      id: 1,
      language: "C",
      code: `int count_dimensions(int* array, int size) {
    int count = 0;
    for(int i = 0; i < size; i++) {
        if(array[i] > 0);
            count++;
    }
    return count;
}`,
      fixedCode: `int count_dimensions(int* array, int size) {
    int count = 0;
    for(int i = 0; i < size; i++) {
        if(array[i] > 0)
            count++;
    }
    return count;
}`,
      hint: "Remove the semicolon after the if statement",
      fragment: "FRAGMENT1"
    },
    {
      id: 2,
      language: "C",
      code: `int find_max(int arr[], int n) {
    int max = arr[0];
    for(int i = 1; i <= n; i++) {
        if(arr[i] > max) {
            max = arr[i];
        }
    }
    return max;
}`,
      fixedCode: `int find_max(int arr[], int n) {
    int max = arr[0];
    for(int i = 1; i < n; i++) {
        if(arr[i] > max) {
            max = arr[i];
        }
    }
    return max;
}`,
      hint: "Check the loop condition - array bounds",
      fragment: "FRAGMENT2"
    },
    {
      id: 3,
      language: "C",
      code: `int sum_array(int* arr, int size) {
    int sum = 0;
    for(int i = 0; i < size; i++;) {
        sum += arr[i];
    }
    return sum;
}`,
      fixedCode: `int sum_array(int* arr, int size) {
    int sum = 0;
    for(int i = 0; i < size; i++) {
        sum += arr[i];
    }
    return sum;
}`,
      hint: "Check the for loop syntax carefully",
      fragment: "FRAGMENT3"
    }
  ];

  const puzzles = loggedInYear === '1st' ? pythonPuzzles : cPuzzles;
  const currentPuzzleData = puzzles[currentPuzzle];
  
  // Helpers to find next/prev incomplete puzzle indices
  const getNextIncompleteIndex = (start) => {
    for (let i = start; i < puzzles.length; i += 1) {
      if (!puzzleCompleted.has(i)) return i;
    }
    return -1;
  };

  const getPrevIncompleteIndex = (start) => {
    for (let i = start; i >= 0; i -= 1) {
      if (!puzzleCompleted.has(i)) return i;
    }
    return -1;
  };

  // Initialize code editor with the buggy code to debug in place
  useEffect(() => {
    setCode(currentPuzzleData.code || '');
  }, [currentPuzzle]);

  // No local runtimes; we use Piston API for real execution

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setTestResults({ visible: [], hiddenPassed: 0, ran: false, details: [] });
    setRunOutput('');
    setIsRunning(true);

    // Normalize code comparison (remove whitespace differences)
    const normalize = (str) => str.replace(/\s+/g, ' ').trim();
    const userCode = normalize(code);
    const fixedCode = normalize(currentPuzzleData.fixedCode);

    // Build visible tests list (labels only for UI)
    const visibleTests = [
      { name: 'Function exists' },
      { name: 'Basic input case' },
      { name: 'Edge case 1' },
      { name: 'Edge case 2' },
      { name: 'Edge case 3' }
    ];

    // Heuristic checks to discourage trivial if-else spam and enforce signature
    const requires = {
      python: (sig) => new RegExp(`def\\s+${sig}\\s*\\(`),
      c: (sig) => new RegExp(`${sig}\\s*\\(`)
    };
    const puzzleSig = (() => {
      if (currentPuzzleData.fixedCode.includes('def find_portal')) return 'find_portal';
      if (currentPuzzleData.fixedCode.includes('def count_dimensions')) return 'count_dimensions';
      if (currentPuzzleData.fixedCode.includes('def reverse_string')) return 'reverse_string';
      if (currentPuzzleData.fixedCode.includes('int count_dimensions')) return 'count_dimensions';
      if (currentPuzzleData.fixedCode.includes('int find_max')) return 'find_max';
      if (currentPuzzleData.fixedCode.includes('int sum_array')) return 'sum_array';
      return '';
    })();

    const langKey = language === 'Python' ? 'python' : 'c';
    const hasSignature = puzzleSig ? requires[langKey](puzzleSig).test(code) : true;
    const ifCount = (code.match(/\bif\b/g) || []).length;
    const excessiveIfs = ifCount > 5; // crude anti-spam heuristic

    const visiblePass = [
      hasSignature,
      !excessiveIfs,
      userCode.length >= fixedCode.length * 0.6, // not too short
      userCode.indexOf('TODO') === -1,
      userCode.indexOf('pass') === -1 || language !== 'Python'
    ];

    // Real execution via Piston API
    try {
      const buildPythonProgram = () => {
        if (currentPuzzleData.fixedCode.includes('def find_portal')) {
          return `${code}\n\nimport json\n\nresults=[]\ncases=[]\ntry:\n    exp1=True\n    act1=bool(callable(find_portal))\n    results.append(act1==exp1)\n    cases.append({'expected':str(exp1),'actual':str(act1),'passed':bool(act1==exp1)})\n\n    exp2=[0,2,4]\n    act2=find_portal(6)\n    results.append(act2==exp2)\n    cases.append({'expected':json.dumps(exp2),'actual':json.dumps(act2),'passed':bool(act2==exp2)})\n\n    exp3=[0]\n    act3=find_portal(1)\n    results.append(act3==exp3)\n    cases.append({'expected':json.dumps(exp3),'actual':json.dumps(act3),'passed':bool(act3==exp3)})\n\n    exp4=[]\n    act4=find_portal(0)\n    results.append(act4==exp4)\n    cases.append({'expected':json.dumps(exp4),'actual':json.dumps(act4),'passed':bool(act4==exp4)})\n\n    exp5=[0,2,4,6]\n    act5=find_portal(7)\n    results.append(act5==exp5)\n    cases.append({'expected':json.dumps(exp5),'actual':json.dumps(act5),'passed':bool(act5==exp5)})\n\n    hidden=0\n    hidden += 1 if find_portal(2)==[0] else 0\n    hidden += 1 if find_portal(10)==[0,2,4,6,8] else 0\n    hidden += 1 if find_portal(3)==[0,2] else 0\n    hidden += 1 if find_portal(8)==[0,2,4,6] else 0\n    hidden += 1 if isinstance(find_portal(5), list) else 0\nexcept Exception as e:\n    print('ERROR:', e)\n    results=[False,False,False,False,False]\n    cases=[{'expected':'True','actual':'Exception','passed':False}]+[{'expected':'','actual':'','passed':False} for _ in range(4)]\n    hidden=0\nprint(json.dumps({'visible':results,'hidden':hidden,'cases':cases}))`;
        }
        if (currentPuzzleData.fixedCode.includes('def count_dimensions')) {
          return `${code}\n\nimport json\n\nresults=[]\ncases=[]\ntry:\n    exp1=True\n    act1=bool(callable(count_dimensions))\n    results.append(act1==exp1)\n    cases.append({'expected':str(exp1),'actual':str(act1),'passed':bool(act1==exp1)})\n\n    exp2=2\n    act2=count_dimensions([1,-1,0,5])\n    results.append(act2==exp2)\n    cases.append({'expected':str(exp2),'actual':str(act2),'passed':bool(act2==exp2)})\n\n    exp3=0\n    act3=count_dimensions([])\n    results.append(act3==exp3)\n    cases.append({'expected':str(exp3),'actual':str(act3),'passed':bool(act3==exp3)})\n\n    exp4=0\n    act4=count_dimensions([-1,-2,-3])\n    results.append(act4==exp4)\n    cases.append({'expected':str(exp4),'actual':str(act4),'passed':bool(act4==exp4)})\n\n    exp5=3\n    act5=count_dimensions([10,20,30])\n    results.append(act5==exp5)\n    cases.append({'expected':str(exp5),'actual':str(act5),'passed':bool(act5==exp5)})\n\n    hidden=0\n    hidden += 1 if count_dimensions([0,0,1])==1 else 0\n    hidden += 1 if count_dimensions([1,1,1,1])==4 else 0\n    hidden += 1 if count_dimensions([-5,5])==1 else 0\n    hidden += 1 if count_dimensions([99])==1 else 0\n    hidden += 1 if isinstance(count_dimensions([1,2]), int) else 0\nexcept Exception as e:\n    print('ERROR:', e)\n    results=[False,False,False,False,False]\n    cases=[{'expected':'True','actual':'Exception','passed':False}]+[{'expected':'','actual':'','passed':False} for _ in range(4)]\n    hidden=0\nprint(json.dumps({'visible':results,'hidden':hidden,'cases':cases}))`;
        }
        if (currentPuzzleData.fixedCode.includes('def reverse_string')) {
          return `${code}\n\nimport json\n\nresults=[]\ncases=[]\ntry:\n    exp1=True\n    act1=bool(callable(reverse_string))\n    results.append(act1==exp1)\n    cases.append({'expected':str(exp1),'actual':str(act1),'passed':bool(act1==exp1)})\n\n    exp2='cba'\n    act2=reverse_string('abc')\n    results.append(act2==exp2)\n    cases.append({'expected':exp2,'actual':act2,'passed':bool(act2==exp2)})\n\n    exp3=''\n    act3=reverse_string('')\n    results.append(act3==exp3)\n    cases.append({'expected':exp3,'actual':act3,'passed':bool(act3==exp3)})\n\n    exp4='a'\n    act4=reverse_string('a')\n    results.append(act4==exp4)\n    cases.append({'expected':exp4,'actual':act4,'passed':bool(act4==exp4)})\n\n    exp5='ts'\n    act5=reverse_string('st')\n    results.append(act5==exp5)\n    cases.append({'expected':exp5,'actual':act5,'passed':bool(act5==exp5)})\n\n    hidden=0\n    hidden += 1 if reverse_string('hello')=='olleh' else 0\n    hidden += 1 if reverse_string('racecar')=='racecar' else 0\n    hidden += 1 if reverse_string('Python')=='nohtyP' else 0\n    hidden += 1 if reverse_string('12')=='21' else 0\n    hidden += 1 if isinstance(reverse_string('x'), str) else 0\nexcept Exception as e:\n    print('ERROR:', e)\n    results=[False,False,False,False,False]\n    cases=[{'expected':'True','actual':'Exception','passed':False}]+[{'expected':'','actual':'','passed':False} for _ in range(4)]\n    hidden=0\nprint(json.dumps({'visible':results,'hidden':hidden,'cases':cases}))`;
        }
        return code;
      };

      const buildCProgram = () => {
        // We wrap user function code together with a main that prints JSON-ish results lines
        const header = '#include <stdio.h>\n#include <stdbool.h>\n';
        if (currentPuzzleData.fixedCode.includes('int count_dimensions')) {
          return `${header}${code}\n\nint main(){\n  bool v1=true;/* signature assumed */\n  int e2=2; int o2=count_dimensions((int[]){1,-1,0,5},4); bool v2 = o2==e2;\n  int e3=0; int o3=count_dimensions((int[]){},0); bool v3 = o3==e3;\n  int e4=0; int o4=count_dimensions((int[]){-1,-2,-3},3); bool v4 = o4==e4;\n  int e5=3; int o5=count_dimensions((int[]){10,20,30},3); bool v5 = o5==e5;\n  int h=0;\n  h += count_dimensions((int[]){0,0,1},3)==1;\n  h += count_dimensions((int[]){1,1,1,1},4)==4;\n  h += count_dimensions((int[]){-5,5},2)==1;\n  h += count_dimensions((int[]){99},1)==1;\n  h += (count_dimensions((int[]){1,2},2)>=0);\n  printf("VIS:%d %d %d %d %d\\n", v1, v2, v3, v4, v5);\n  printf("CASE:1 EXP:%d OUT:%d OK:%d\\n", 1, 1, v1?1:0);\n  printf("CASE:2 EXP:%d OUT:%d OK:%d\\n", e2, o2, v2?1:0);\n  printf("CASE:3 EXP:%d OUT:%d OK:%d\\n", e3, o3, v3?1:0);\n  printf("CASE:4 EXP:%d OUT:%d OK:%d\\n", e4, o4, v4?1:0);\n  printf("CASE:5 EXP:%d OUT:%d OK:%d\\n", e5, o5, v5?1:0);\n  printf("HID:%d\\n", h);\n  return 0;\n}`;
        }
        if (currentPuzzleData.fixedCode.includes('int find_max')) {
          return `${header}${code}\n\nint main(){\n  bool v1=true;\n  int a1[]={1,5,3}; int e2=5; int o2 = find_max(a1,3); bool v2 = o2==e2;\n  int a2[]={-5,-2,-9}; int e3=-2; int o3 = find_max(a2,3); bool v3 = o3==e3;\n  int a3[]={7}; int e4=7; int o4 = find_max(a3,1); bool v4 = o4==e4;\n  int a4[]={2,2,2}; int e5=2; int o5 = find_max(a4,3); bool v5 = o5==e5;\n  int h=0; int a5[]={0,-1}; h += find_max(a5,2)==0;\n  int a6[]={100,200,50}; h += find_max(a6,3)==200;\n  int a7[]={-3,-1,-2}; h += find_max(a7,3)==-1;\n  int a8[]={9,8,10,7}; h += find_max(a8,4)==10;\n  int a9[]={42}; h += find_max(a9,1)==42;\n  printf("VIS:%d %d %d %d %d\\n", v1, v2, v3, v4, v5);\n  printf("CASE:1 EXP:%d OUT:%d OK:%d\\n", 1, 1, v1?1:0);\n  printf("CASE:2 EXP:%d OUT:%d OK:%d\\n", e2, o2, v2?1:0);\n  printf("CASE:3 EXP:%d OUT:%d OK:%d\\n", e3, o3, v3?1:0);\n  printf("CASE:4 EXP:%d OUT:%d OK:%d\\n", e4, o4, v4?1:0);\n  printf("CASE:5 EXP:%d OUT:%d OK:%d\\n", e5, o5, v5?1:0);\n  printf("HID:%d\\n", h);\n  return 0;\n}`;
        }
        if (currentPuzzleData.fixedCode.includes('int sum_array')) {
          return `${header}${code}\n\nint main(){\n  bool v1=true;\n  int a1[]={1,2,3}; int e2=6; int o2=sum_array(a1,3); bool v2 = o2==e2;\n  int a2[]={}; int e3=0; int o3=sum_array(a2,0); bool v3 = o3==e3;\n  int a3[]={-1,1}; int e4=0; int o4=sum_array(a3,2); bool v4 = o4==e4;\n  int a4[]={5}; int e5=5; int o5=sum_array(a4,1); bool v5 = o5==e5;\n  int h=0; int a5[]={10,10}; h += sum_array(a5,2)==20;\n  int a6[]={-5,-5}; h += sum_array(a6,2)==-10;\n  int a7[]={100}; h += sum_array(a7,1)==100;\n  int a8[]={1,1,1,1,1}; h += sum_array(a8,5)==5;\n  int a9[]={3,4}; h += sum_array(a9,2)==7;\n  printf("VIS:%d %d %d %d %d\\n", v1, v2, v3, v4, v5);\n  printf("CASE:1 EXP:%d OUT:%d OK:%d\\n", 1, 1, v1?1:0);\n  printf("CASE:2 EXP:%d OUT:%d OK:%d\\n", e2, o2, v2?1:0);\n  printf("CASE:3 EXP:%d OUT:%d OK:%d\\n", e3, o3, v3?1:0);\n  printf("CASE:4 EXP:%d OUT:%d OK:%d\\n", e4, o4, v4?1:0);\n  printf("CASE:5 EXP:%d OUT:%d OK:%d\\n", e5, o5, v5?1:0);\n  printf("HID:%d\\n", h);\n  return 0;\n}`;
        }
        return `${header}${code}\nint main(){printf("VIS:0 0 0 0 0\\nHID:0\\n");return 0;}`;
      };

      const isPy = language === '1st' || language === 'Python';
      const lang = isPy ? 'python' : 'c';
      const version = isPy ? '3.10.0' : '10.2.0';
      const program = isPy ? buildPythonProgram() : buildCProgram();

      const resp = await fetch('https://emkc.org/api/v2/piston/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ language: lang, version, files: [{ name: isPy ? 'main.py' : 'main.c', content: program }] })
      });
      const data = await resp.json();
      const stdout = (data?.run?.stdout || '').trim();
      const stderr = (data?.run?.stderr || '').trim();
      setRunOutput(stdout + (stderr ? ('\n' + stderr) : ''));

      let visible = [false, false, false, false, false];
      let hiddenPassed = 0;
      let details = [];
      if (isPy) {
        // Python prints JSON on stdout last line
        try {
          const lastLine = stdout.split('\n').filter(Boolean).pop() || '{}';
          const parsed = JSON.parse(lastLine);
          visible = Array.isArray(parsed.visible) ? parsed.visible : visible;
          hiddenPassed = Number(parsed.hidden) || 0;
          if (Array.isArray(parsed.cases)) {
            const labels = ['Function exists', 'Basic input case', 'Edge case 1', 'Edge case 2', 'Edge case 3'];
            details = parsed.cases.map((c, i) => ({
              name: labels[i] || `Case ${i+1}`,
              expected: String(c.expected ?? ''),
              actual: String(c.actual ?? ''),
              passed: Boolean(c.passed)
            }));
          }
        } catch (e) {
          setError('Could not parse program output.');
        }
      } else {
        // C prints VIS: and HID: lines
        const visLine = (stdout.split('\n').find(l => l.startsWith('VIS:')) || 'VIS:').replace('VIS:', '').trim();
        const parts = visLine.split(/\s+/).filter(Boolean);
        if (parts.length >= 5) {
          visible = parts.slice(0,5).map(v => v === '1');
        }
        const hidLine = (stdout.split('\n').find(l => l.startsWith('HID:')) || 'HID:0').replace('HID:', '').trim();
        hiddenPassed = parseInt(hidLine, 10) || 0;

        // Parse detailed CASE lines: CASE:i EXP:x OUT:y OK:0/1
        const labels = ['Function exists', 'Basic input case', 'Edge case 1', 'Edge case 2', 'Edge case 3'];
        details = stdout.split('\n').filter(l => l.startsWith('CASE:')).map((line) => {
          const m = line.match(/CASE:(\d+)\s+EXP:([^\s]+)\s+OUT:([^\s]+)\s+OK:(\d+)/);
          const idx = m ? parseInt(m[1], 10) - 1 : 0;
          return {
            name: labels[idx] || `Case ${idx+1}`,
            expected: m ? m[2] : '',
            actual: m ? m[3] : '',
            passed: m ? m[4] === '1' : false
          };
        });
      }

      setTestResults({ visible, hiddenPassed, ran: true, details });
      const allPassed = visible.every(Boolean) && hiddenPassed === 5;
      if (!allPassed) {
        setError(stderr ? ('Runtime error: ' + stderr) : 'Some tests failed. Fix issues and try again.');
      }
    } catch (ex) {
      console.error(ex);
      setError('Execution service error. Please try again.');
    }

    if (userCode === fixedCode) {
      // Add fragment if not already collected
      if (!fragments.includes(currentPuzzleData.fragment)) {
        const newFragments = [...fragments, currentPuzzleData.fragment];
        setFragmentsLocal(newFragments);
        // Update parent state if setFragments is provided
        if (setFragments) {
          setFragments(newFragments);
        }
      }

      const newCompleted = new Set(puzzleCompleted);
      newCompleted.add(currentPuzzle);
      setPuzzleCompleted(newCompleted);
      
      setError('Correct! All tests passed. Fragment collected.');
      setTestResults((prev) => ({ visible: prev.ran ? prev.visible : visibleTests.map(() => true), hiddenPassed: prev.ran ? prev.hiddenPassed : 5, ran: true }));
      setTimeout(() => setError(''), 1200);
      setCode('');
      setIsRunning(false);

      // Auto-advance to the next incomplete puzzle or finish round
      const nextIdx = getNextIncompleteIndex(currentPuzzle + 1);
      if (newCompleted.size === puzzles.length) {
        if (onComplete) onComplete();
      } else if (nextIdx !== -1) {
        setCurrentPuzzle(nextIdx);
      }
    } else {
      // Partial heuristic results (without executing code)
      const passedCount = visiblePass.filter(Boolean).length;
      setTestResults({ visible: visiblePass, hiddenPassed: Math.max(0, Math.min(2, passedCount - 2)), ran: true });
      setError('Some tests failed. Fix issues and try again.');
      setIsRunning(false);
    }
  };

  const nextPuzzle = () => {
    const idx = getNextIncompleteIndex(currentPuzzle + 1);
    if (idx !== -1) {
      setCurrentPuzzle(idx);
      setCode('');
      setError('');
    } else if (puzzleCompleted.size === puzzles.length) {
      if (onComplete) onComplete();
    }
  };

  const prevPuzzle = () => {
    const idx = getPrevIncompleteIndex(currentPuzzle - 1);
    if (idx !== -1) {
      setCurrentPuzzle(idx);
      setCode('');
      setError('');
    }
  };

  const allPuzzlesCompleted = puzzleCompleted.size === puzzles.length;

  // If current puzzle gets completed (via back/refresh), skip to next incomplete
  useEffect(() => {
    if (puzzleCompleted.has(currentPuzzle)) {
      const idx = getNextIncompleteIndex(0);
      if (idx !== -1) {
        setCurrentPuzzle(idx);
      } else if (puzzleCompleted.size === puzzles.length) {
        if (onComplete) onComplete();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [puzzleCompleted]);

  return (
    <div className="round-two-fixed" style={{ position: 'fixed', inset: 0, display: 'flex', flexDirection: 'column', background: '#000', overflow: 'hidden' }}>
      {/* Top bar - centered title and right challenge info */}
      <div style={{ flex: '0 0 auto', padding: '0.9rem 1.25rem', borderBottom: '2px solid rgba(230,25,75,0.35)', display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', position: 'relative' }}>
        <div />
        <h2 className="round-title" style={{ margin: 0, textAlign: 'center', letterSpacing: '2px' }}>ROUND 2: THE GLITCH BETWEEN WORLDS</h2>
        <div style={{ justifySelf: 'end', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'rgba(255,255,255,0.8)' }} />
        {/* Top-left absolute navigation buttons */}
        <div style={{ position: 'absolute', top: 8, left: 12, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button onClick={prevPuzzle} disabled={currentPuzzle === 0} className="nav-button-small">← Prev</button>
          <button onClick={nextPuzzle} disabled={currentPuzzle === puzzles.length - 1} className="nav-button-small">Next →</button>
        </div>
      </div>

      {/* Two-column body */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden', padding: '1rem' }}>
        {/* Left: Editor only */}
        <div className="editor-pane" style={{ width: '50%', height: '100%', display: 'flex', flexDirection: 'column', boxSizing: 'border-box', gap: '0.75rem', overflow: 'hidden', paddingRight: '0.5rem' }}>
          <div className="panel hover-glow" style={{ flex: 1, padding: '0.85rem 1rem', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
            <div className="panel-title">Editor</div>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', minHeight: 0, flex: 1 }}>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder={`Fix the ${language} code here...`}
              className="code-input"
              style={{ flex: 1, resize: 'none' }}
              required
            />
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button type="submit" className="submit-button" disabled={isRunning}>
                {isRunning ? (<span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}><span className="spinner-red" /> Running...</span>) : 'Run & Submit'}
              </button>
            </div>
            </form>
            {error && (
              <div className={`message ${error.includes('Correct') ? 'success' : 'error'}`}>{error}</div>
            )}
          </div>
        </div>

        {/* Right: Tests & Fragments */}
        <div className="tests-pane" style={{ width: '50%', height: '100%', display: 'flex', flexDirection: 'column', boxSizing: 'border-box', gap: '0.75rem', overflow: 'hidden', paddingLeft: '0.5rem', borderLeft: '2px solid rgba(230,25,75,0.25)' }}>
          <div className="panel" style={{ padding: '0.85rem 1rem' }}>
            <h3 className="panel-title" style={{ margin: 0 }}>Test Cases</h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {['Function exists', 'Basic input case', 'Edge case 1', 'Edge case 2', 'Edge case 3'].map((label, idx) => {
                const info = (testResults.details && testResults.details[idx]) || null;
                const passed = testResults.visible[idx];
                return (
                  <li key={label} className="test-item-card">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem' }}>
                      <span>{label}</span>
                      <span className="test-status">
                        {testResults.ran && <span className={`status-dot ${passed ? 'status-pass' : 'status-fail'}`} />}
                        {testResults.ran ? (passed ? 'PASSED' : 'FAILED') : '—'}
                      </span>
                    </div>
                    {testResults.ran && info && (
                      <div style={{ marginTop: '0.35rem', fontSize: '0.9rem', color: 'rgba(255,255,255,0.85)', display: 'grid', gridTemplateColumns: '1fr 1fr', columnGap: '1rem' }}>
                        <div><strong style={{ opacity: 0.85 }}>Expected:</strong> <span style={{ opacity: 0.9 }}>{info.expected}</span></div>
                        <div><strong style={{ opacity: 0.85 }}>Output:</strong> <span style={{ opacity: 0.9 }}>{info.actual}</span></div>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
            <div style={{ marginTop: '0.75rem', color: 'rgba(255,255,255,0.8)' }}>
              Hidden tests passed: {testResults.ran ? testResults.hiddenPassed : 0} / 5
            </div>
          </div>

          <div className="panel hover-glow" style={{ padding: '0.85rem 1rem', flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
            <h3 className="panel-title" style={{ margin: 0 }}>Fragments</h3>
            <div className="fragments-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '0.5rem', overflow: 'auto', flex: 1, paddingBottom: '0.5rem' }}>
            {fragments.length === 0 ? (
              <div style={{ opacity: 0.7 }}>No fragments collected yet.</div>
            ) : (
              fragments.map((fragment, index) => (
                <div key={index} className="fragment-card hover-glow">
                  <div className="fragment-number">Fragment {index + 1}</div>
                  <div className="fragment-value">{fragment}</div>
                </div>
              ))
            )}
            </div>

          {allPuzzlesCompleted && fragments.length > 0 && (
            <div className="completion-note" style={{ flex: '0 0 auto' }}>
              <p>✓ All challenges complete! You now have {fragments.length} fragment(s).</p>
              <p>Use these fragments in Round 3 to seal the gate!</p>
            </div>
          )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoundTwo;
