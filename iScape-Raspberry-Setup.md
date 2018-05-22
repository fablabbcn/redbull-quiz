<h1 id="iscape-interactive-quiz-documentation">iScape interactive Quiz documentation</h1>
<h2 id="adding-or-editing-questions">Adding or editing questions</h2>
<p>All the questions and their details (answers, images, tips, how dangerous) are stored in <code>src/data/</code>  and as a single file for each <em>language</em> or <em>location</em>.</p>
<p>See this file for example:<br>
<a href="https://github.com/fablabbcn/iscape-air-pollution-quiz/blob/express/src/data/en.js">https://github.com/fablabbcn/iscape-air-pollution-quiz/blob/express/src/data/en.js</a></p>
<p>There is also a helper file for <a href="https://github.com/fablabbcn/iscape-air-pollution-quiz/blob/express/src/data/helper.js">translations here</a></p>
<p><strong>Example</strong>:<br>
If you select the <strong>first</strong> suggestion in a question:<br>
<em>"I live in a house near a busy highway"</em><br>
You get the <strong>first</strong> item from the results:<br>
<em>‘Pollution is typically higher’</em>,<br>
and the first image, the first tip etc.</p>
<p>If you need to add a question, we recommend you copy and paste a question and then edit it, to make sure that all the commas and curly braces are intact. A single question is everything inside, along with the curly braces {}</p>
<p>When you are done, you can make a <strong>Pull request</strong> on Github, and we will review it and put it in production.</p>
<h2 id="setup-the-raspberry-pi-for-offline-mode">Setup the Raspberry Pi for offline mode</h2>
<p>This will list the steps needed to make a normal Raspberry Pi run and auto play the iScape quiz offline.</p>
<ol>
<li>
<p>Make sure you have a Raspberry Pi with the Raspbian OS</p>
</li>
<li>
<p>Install required software<br>
<code>cd</code><br>
<code>git clone https://github.com/fablabbcn/iscape-air-pollution-quiz</code><br>
<code>curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.11/install.sh | bash</code><br>
<code>export NVM_DIR="$HOME/.nvm"</code><br>
<code>nvm install 8</code><br>
<code>cd iscape-air-pollution-quiz</code><br>
<code>nvm use 8</code><br>
<code>npm i</code></p>
</li>
<li>
<p>Start the quiz locally automatically on reboot.<br>
Add the following line to the bottom of<code>.bashrc</code><br>
<code>cd iscape-air-pollution-quiz/ &amp;&amp; npm run logger &amp;</code></p>
</li>
<li>
<p>Start a browser in full screen<br>
Edit <code>.config/lxsession/LXDE-pi/autostart</code> and make sure it has the following:</p>
<blockquote>
<p>#@xscreensaver -no-splash<br>
@xset s noblank<br>
@xset s off<br>
@xset -dpms<br>
@point-rpi<br>
@/usr/bin/chromium-browser --incognito --kiosk <a href="http://localhost:3000">http://localhost:3000</a></p>
</blockquote>
<p>This disables the screensaver and blank screen and starts it in full screen ‘kiosk’ mode.</p>
</li>
<li>
<p>Reboot the kit</p>
</li>
</ol>
<h2 id="retrieve-log-files">Retrieve log files</h2>
<p>The log files should be at <code>~/log.txt</code></p>
<p>They are in the format:</p>
<ul>
<li>StartDate, EndDate, TotalExposure, Each questions Guess [0 or 1]</li>
</ul>
<h2 id="faq">FAQ</h2>
<ul>
<li>The site does not load right away.
<ul>
<li>This is normal. It takes time to start the whole app on a Raspberry Pi. It will load within a minute.</li>
</ul>
</li>
<li>Black border around screen on Raspberry Pi. This can happen on some TV screens or monitors.
<ul>
<li>Uncomment <code>disable_overscan=1</code> line in <code>/boot/config.txt</code><br>
See: <a href="https://www.raspberrypi.org/forums/viewtopic.php?t=47152">https://www.raspberrypi.org/forums/viewtopic.php?t=47152</a></li>
</ul>
</li>
</ul>

