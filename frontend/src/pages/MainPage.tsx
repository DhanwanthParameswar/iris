function MainPage() {
    return (       
<div style={{width: 440, height: 956, background: 'linear-gradient(0deg, #F9FAFB 0%, #F9FAFB 100%), white', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
  <div style={{alignSelf: 'stretch', flex: '1 1 0', position: 'relative', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center', display: 'flex'}}>
    <div style={{alignSelf: 'stretch', height: 115, paddingLeft: 192, paddingRight: 192, paddingTop: 24, paddingBottom: 24, flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'center', display: 'flex'}}>
      <div style={{width: '100%', maxWidth: 1536, paddingRight: 0.01, justifyContent: 'space-between', alignItems: 'center', display: 'inline-flex'}}>
        <div style={{justifyContent: 'flex-start', alignItems: 'center', gap: 8, display: 'flex'}}>
          <div style={{justifyContent: 'center', display: 'flex', flexDirection: 'column', color: '#1F2937', fontSize: 48, fontFamily: 'Sora', fontWeight: '700', lineHeight: 28, wordWrap: 'break-word'}}>Iris</div>
        </div>
      </div>
    </div>
    <div style={{width: 440, height: 849, paddingTop: 19, paddingBottom: 77, paddingLeft: 40, paddingRight: 40, left: 0, top: 54, position: 'absolute', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 20, display: 'flex'}}>
      <img style={{width: 212, height: 196, borderRadius: 106}} src="https://placehold.co/212x196" />
      <div style={{alignSelf: 'stretch', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center', display: 'flex'}}>
        <div style={{alignSelf: 'stretch', textAlign: 'center', justifyContent: 'center', display: 'flex', flexDirection: 'column'}}><span style={{color: '#1F2937', fontSize: 39, fontFamily: 'Sora', fontWeight: '700', lineHeight: 45, wordWrap: 'break-word'}}>Meet Your New </span><span style={{color: '#1287FF', fontSize: 39, fontFamily: 'Sora', fontWeight: '700', lineHeight: 45, wordWrap: 'break-word'}}>AI<br/>Companion</span></div>
      </div>
      <div style={{width: '100%', maxWidth: 576, paddingBottom: 10, flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center', display: 'flex'}}>
        <div style={{alignSelf: 'stretch', textAlign: 'center', justifyContent: 'center', display: 'flex', flexDirection: 'column', color: '#6B7280', fontSize: 12, fontFamily: 'Poppins', fontWeight: '400', lineHeight: 20, wordWrap: 'break-word'}}>Start a conversation and discover a smarter way to get things done. Our friendly AI is here to assist you 24/7.</div>
      </div>
      <div style={{paddingLeft: 32, paddingRight: 32, paddingTop: 12, paddingBottom: 12, background: '#1287FF', boxShadow: '0px 4px 6px -4px rgba(0, 0, 0, 0.10)', overflow: 'hidden', borderRadius: 16, justifyContent: 'center', alignItems: 'center', display: 'inline-flex'}}>
        <div style={{textAlign: 'center', justifyContent: 'center', display: 'flex', flexDirection: 'column', color: 'white', fontSize: 18, fontFamily: 'Sora', fontWeight: '600', lineHeight: 28, wordWrap: 'break-word'}}>Start Chatting Now</div>
      </div>
    </div>
  </div>
</div>
    );
}

export default MainPage;