# Frontend Changes for Multi-Part Responses

## 1. API Response Handling

**Current Response:**
```javascript
{
  "message": "Your career analysis..."
}
```

**New Response:**
```javascript
{
  "message": "Your career analysis...",
  "metadata": {
    "questionType": "career",
    "isFollowUp": false,
    "hasFollowUpOptions": true
  }
}
```

## 2. Quick Reply Buttons (Optional Enhancement)

When `hasFollowUpOptions: true`, show quick reply buttons:

```javascript
// Detect numbered options in response
const hasOptions = response.message.includes('1.') && response.message.includes('2.');

if (hasOptions) {
  // Extract options and show as buttons
  const options = ['1', '2', '3'];
  showQuickReplyButtons(options);
}
```

## 3. Message Display Enhancement

```javascript
// Enhanced message component
function MessageComponent({ message, metadata }) {
  return (
    <div className="message">
      <div className="message-text">{message}</div>
      
      {metadata?.hasFollowUpOptions && (
        <div className="quick-replies">
          <button onClick={() => sendMessage('1')}>Option 1</button>
          <button onClick={() => sendMessage('2')}>Option 2</button>
          <button onClick={() => sendMessage('3')}>Option 3</button>
        </div>
      )}
    </div>
  );
}
```

## 4. Minimal Required Changes

**Option A: No Changes (Works as-is)**
- Current frontend will work without any changes
- Users can type "1", "2", or "3" manually
- Multi-part responses appear as regular messages

**Option B: Basic Enhancement (5 minutes)**
```javascript
// Just handle the new response format
const response = await fetch('/api/chat', {
  method: 'POST',
  body: JSON.stringify({ sessionId, message, birthDetails })
});

const data = await response.json();
displayMessage(data.message); // Works exactly as before
// Optionally use data.metadata for enhancements
```

**Option C: Full Enhancement (30 minutes)**
- Add quick reply buttons for numbered options
- Visual indicators for follow-up questions
- Better UX for multi-part conversations

## 5. Backward Compatibility

✅ **100% Backward Compatible**
- Existing frontend code continues to work
- `response.message` still contains the full text
- `metadata` is optional additional data

## Recommendation

**Start with Option A** (no changes) - the system works immediately. Then optionally add quick reply buttons later for better UX.