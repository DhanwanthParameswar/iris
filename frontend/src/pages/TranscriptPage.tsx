function TranscriptPage() {
  return (
<div style={{width: 440, height: 956, padding: 20, background: 'linear-gradient(0deg, #F8FAFC 0%, #F8FAFC 100%), white', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
  <div style={{alignSelf: 'stretch', flex: '1 1 0', paddingLeft: 21, paddingRight: 21, justifyContent: 'center', alignItems: 'center', display: 'inline-flex'}}>
    <div style={{flex: '1 1 0', height: 903, paddingTop: 75, position: 'relative', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center', display: 'inline-flex'}}>
      <div style={{alignSelf: 'stretch', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 8, display: 'flex'}}>
        <div style={{alignSelf: 'stretch', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'flex'}}>
          <div style={{alignSelf: 'stretch', textAlign: 'center', justifyContent: 'center', display: 'flex', flexDirection: 'column', color: '#0F172A', fontSize: 36, fontFamily: 'Poppins', fontWeight: '700', lineHeight: 40, wordWrap: 'break-word'}}>Transcript</div>
        </div>
        <div style={{alignSelf: 'stretch', height: 66, paddingTop: 21, paddingBottom: 21}} />
      </div>
      <div style={{alignSelf: 'stretch', height: 555, paddingBottom: 20, overflow: 'hidden', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', gap: 32, display: 'flex'}}>
        <div style={{alignSelf: 'stretch', paddingLeft: 13, paddingRight: 13, paddingTop: 9, paddingBottom: 9, background: '#F8FAFC', overflow: 'hidden', borderRadius: 8, outline: '1px #CBD5E1 solid', outlineOffset: '-1px', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'flex'}}>
          <div style={{alignSelf: 'stretch', overflow: 'hidden', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'flex'}}>
            <div style={{justifyContent: 'center', display: 'flex', flexDirection: 'column', color: 'black', fontSize: 14, fontFamily: 'Sora', fontWeight: '400', lineHeight: 24, wordWrap: 'break-word'}}>Hey!             Hey how’s it going             Sample text             Sample Response             Sample text             Sample Response             Sample text             Sample Response </div>
          </div>
        </div>
      </div>
      <div style={{width: 358, paddingTop: 17, left: 0, top: 769, position: 'absolute', borderTop: '1px #E2E8F0 solid', justifyContent: 'flex-end', alignItems: 'flex-start', display: 'inline-flex'}}>
        <div style={{paddingLeft: 35, paddingRight: 35, paddingTop: 13, paddingBottom: 13, left: 80, top: 17, position: 'absolute', background: '#1287FF', boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.05)', borderRadius: 16, justifyContent: 'center', alignItems: 'center', gap: 10, display: 'flex'}}>
          <div style={{textAlign: 'center', justifyContent: 'center', display: 'flex', flexDirection: 'column', color: 'white', fontSize: 18, fontFamily: 'Sora', fontWeight: '600', lineHeight: 24, wordWrap: 'break-word'}}>View Analysis</div>
        </div>
      </div>
    </div>
  </div>
</div>
  );
}

export default TranscriptPage;