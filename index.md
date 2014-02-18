---
layout: default
title: Seth Roberts and The Shangri-La Diet
desc: Articles and related links about The Shangri-La Diet and other research by Seth Roberts.
page: index
---
<!-- Section One -->
<div id="secOne">
	{% capture section_one %}{% include section-1.0.md %}{% endcapture %}
	{{ section_one | markdownify }}
</div>

<!-- Section Two -->
<div id="secTwo">
	{% capture section_two %}{% include section-2.0.md %}{% endcapture %}
	{{ section_two | markdownify }}
</div>

<!-- Section Three -->
<div id="secThree">
	<h2><a href="http://boards.sethroberts.net/"><img src="/images/hotForumsHeader.png" alt="Hot of the Forums" width="400" height="33" border="0"/></a></h2>
	{% capture section_three %}{% include section-3.0.md %}{% endcapture %}
	{{ section_three | markdownify }}
	<div class="smaller" align="center"><a href="/archives/">previously</a> in <em>Hot Off The Forums</em></div>
</div>

<!-- Section Four -->
<div id="secFour">
	<fieldset>
		<legend>&#x2022; TV KSLD &#x2022;</legend>
		{% capture section_four_one %}{% include section-4.1.md %}{% endcapture %}
		{{ section_four_one | markdownify }}
	</fieldset>
	<fieldset>
		<legend>&#x2022; Radio KSLD &#x2022; </legend>
		{% capture section_four_two %}{% include section-4.2.md %}{% endcapture %}
		{{ section_four_two | markdownify }}
	</fieldset>
</div>

<div id="secFive">
	{% capture section_five %}{% include section-5.0.md %}{% endcapture %}
	{{ section_five | markdownify }}
</div>
