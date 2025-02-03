import Button from "./Button";

const MDSCommands = () => {
  return <div className="flex flex-col gap-2">

    <hr />

    <h1>seedrandom</h1>
    <div className="flex flex-col gap-2">
      <Button command="seedrandom modifier:123" title="seedrandom modifier:123" />
    </div>

    <hr />

    <h1>MDS</h1>
    <div className="flex flex-col gap-2">
      <Button command="mds" title="mds" />
      <Button command="mds action:list" title="mds action:list" />
      <Button command="mds action:install file:123" title="mds action:install file:123" />
      <Button command="mds action:install file:123 trust:read" title="mds action:install file:123 trust:read" />
      <Button command="mds action:install file:123 trust:write" title="mds action:install file:123 trust:write" />
      <Button command="mds action:update uid:0x00 file:123" title="mds action:update uid:0x00 file:123" />
      <Button command="mds action:uninstall uid:0x00" title="mds action:uninstall uid:0x00" />
      <Button command="mds action:download uid:0x00" title="mds action:download uid:0x00" />
      <Button command="mds action:download uid:0x00 folder:123" title="mds action:download uid:0x00 folder:123" />
      <Button command="mds action:download uid:0x00 locationonly:true" title="mds action:download uid:0x00 locationonly:true" />
      <Button command="mds action:pending" title="mds action:pending" />
      <Button command="mds action:accept uid:123" title="mds action:accept uid:123" />
      <Button command="mds action:deny uid:123" title="mds action:deny uid:123" />
      <Button command="mds action:permission uid:123 trust:read" title="mds action:permission uid:123 trust:read" />
      <Button command="mds action:permission uid:123 trust:write" title="mds action:permission uid:123 trust:write" />
      <Button command="mds action:publicmds enable:true" title="mds action:publicmds enable:true" />
      <Button command="mds action:publicmds enable:false" title="mds action:publicmds enable:false" />
    </div>

    <hr />

    <h1>backup</h1>
    <div className="flex flex-col gap-2">
      <Button command="backup" title="backup" />
      <Button command="backup password:123 file:file.txt auto:true maxhistory:10" title="backup password:123 file:file.txt auto:true maxhistory:10" />
      <Button command="backup password:123 file:file.txt auto:false maxhistory:10" title="backup password:123 file:file.txt auto:false maxhistory:10" />
    </div>

    <hr />

    <h1>restore</h1>
    <div className="flex flex-col gap-2">
      <Button command="restore file:file.txt" title="restore file:file.txt" />
      <Button command="restore file:file.txt password:123" title="restore file:file.txt password:123" />
    </div>

    <hr />

    <h1>restoresync</h1>
    <div className="flex flex-col gap-2">
      <Button command="restoresync file:file.txt" title="restoresync file:file.txt" />
      <Button command="restoresync file:file.txt password:123 host:megammr.minima.global:9001" title="restoresync file:file.txt password:123 host:megammr.minima.global:9001" />
    </div>

    <hr />

    <h1>rpc</h1>
    <div className="flex flex-col gap-2">
      <Button command="rpc enable:true" title="rpc enable:true" />
      <Button command="rpc enable:true ssl:true" title="rpc enable:true ssl:true" />
      <Button command="rpc enable:true password:123" title="rpc enable:true password:123" />
      <Button command="rpc enable:false" title="rpc enable:false" />
    </div>

    <hr />

    <h1>removescript</h1>
    <div className="flex flex-col gap-2">
      <Button command="removescript address:0x8ABA761822D343C479933AC74FFF792805827FC48C312AFBC3C266CEEE317BB9" title="removescript address:0x8ABA761822D343C479933AC74FFF792805827FC48C312AFBC3C266CEEE317BB9" />
      <Button command="removescript address:123" title="removescript address:123" />
    </div>

    <hr />

    <h1>megammrsync</h1>
    <div className="flex flex-col gap-2">
      {
        [
          "megammrsync action:mydetails",
          "megammrsync action:resync host:megammr.minima.global:9001 phrase:123 anyphrase:true keys:64 keyuses:64 file:123.txt password:123",
          "megammrsync action:resync host:megammr.minima.global:9001 phrase:123 anyphrase:false",
        ].map((command) => {
          return <Button command={command} title={command} />
        })
      }
    </div>

    <hr />

    <h1>archive</h1>
    <div className="flex flex-col gap-2">
      {
        [
          "archive action:integrity",
          "archive action:inspect file:text.txt",
          "archive action:export",
          "archive action:export file:text.txt",
          "archive action:exportraw",
          "archive action:exportraw file:text.txt",
          "archive action:resync host:megammr.minima.global:9001 phrase:123 anyphrase:true keys:64 keyuses:64 file:123.txt",
          "archive action:resync host:megammr.minima.global:9001 phrase:123 anyphrase:false",
          "archive action:import phrase:123 anyphrase:true keys:64 keyuses:64 file:123.txt",
          "archive action:import phrase:123 anyphrase:false keys:64 keyuses:64 file:123.txt",
          "archive action:addresscheck address:abc statecheck:1 logs:true maxexport:123",
          "archive action:addresscheck address:abc statecheck:1 logs:false maxexport:123",
        ].map((command) => {
          return <Button command={command} title={command} />
        })
      }
    </div>

    <hr />

    <h1>mysql</h1>
    <div className="flex flex-col gap-2">
      {
        [
          "mysql host:127.0.0.1:3306 database:test user:root password:123",
          "mysql action:info host:127.0.0.1:3306 database:test user:root password:123",
          "mysql action:info readonly:true",
          "mysql action:info readonly:false",
          "mysql action:integrity",
          "mysql action:update",
          "mysql action:addresscheck address:123",
          "mysql action:setlogin host:127.0.0.1:3306 database:test user:root password:123",
          "mysql action:clearlogin",
          "mysql action:autobackup enable:true",
          "mysql action:findtxpow txpowid:0xFF",
          "mysql action:resync phrase:123 keys:64 keyuses:64",
          "mysql action:wipe",
          "mysql action:h2export file:text.txt",
          "mysql action:h2export",
          "mysql action:h2import file:text.txt",
          "mysql action:rawexport file:text.txt",
          "mysql action:rawexport",
          "mysql action:rawimport file:text.txt",
        ].map((command) => {
          return <Button command={command} title={command} />
        })
      }
    </div>

    <hr />

    <h1>mysqlcoins</h1>
    <div className="flex flex-col gap-2">
      {
        [
          "mysqlcoins host: database: user: password: host:127.0.0.1:3306 database:test user:root password:123",
          "mysqlcoins action:info",
          "mysqlcoins action:info readonly:true",
          "mysqlcoins action:info readonly:false",
          "mysqlcoins action:wipe",
          "mysqlcoins action:update",
          "mysqlcoins action:update maxcoins:50",
          "mysqlcoins action:search address:0xFF",
          "mysqlcoins action:search where:id=123",
          "mysqlcoins action:search query:query_placeholder",
          "mysqlcoins action:search query:query_placeholder limit:1",
        ].map((command) => {
          return <Button command={command} title={command} />
        })
      }
    </div>

  </div>
};

export default MDSCommands;
