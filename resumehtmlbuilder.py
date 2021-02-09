import json

with open("assets/data/resume.json") as f:
    data = json.load(f)

# Add head and built in stuff
# Also start body tag
html = """
<!DOCTYPE html>
<html lang="en">
<!-- DO NOT EDIT THIS PAGE DIRECTLY, THIS IS AUTOMATICALLY GENERATED -->

<head>
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Daniel Gillies</title>
    <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.0.0-alpha1/jquery.min.js"></script>
    <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/normalize/3.0.3/normalize.min.css" />
    <link rel="stylesheet" type="text/css" href="https://fonts.googleapis.com/css?family=Montserrat:400,700%7COpen+Sans" />
    <link rel="stylesheet" type="text/css" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css" />
    <link rel="stylesheet" type="text/css" href="assets/css/resume.css" />
    <script>
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

  ga('create', 'UA-102721545-1', 'auto');
  ga('send', 'pageview');

</script>
</head>

<body>
<div class="btn dl-btn download">
    <a href="javascript: w=window; w.print();">Save as PDF</a>
</div>
<div class="main-wrap">
"""

# Build basics section
html += f"""<header class="header">
                <h1>{data['basics']['name']}</h1>
                <h3 class="label">{data['basics']['title']}</h3>
                <ul id="contact" class="contact-list list-lines">
                    <li class="contact-header">{data['basics']['phone']}</li>
                    <li class="contact-header">{data['basics']['email']}</li>
                    <li class="contact-header"><a href="//{data['basics']['website']}">{data['basics']['website']}</a></li>
                </ul>
                <ul id="profiles" class="profiles-list list-set">
                    <li><a href="{data['basics']['github']}" target="_blank" class="profile" title="Github"><i class="fa fa-github"></i><span class="profile-name">Github</span></a></li>
                    <li><a href="{data['basics']['linkedin']}" target="_blank" class="profile" title="Linkedin"><i class="fa fa-linkedin"></i><span class="profile-name">Linked In</span></a></li>
                </ul>
            </header>

            <main class="main">
            <section id="about" class="section">
                <h2><i class="fa fa-user left"></i>About</h2>
                <p>{data['basics']['about']}</p>
            </section>"""

########### Begin work section
html += """<section id="work" class="section">
        <h2><i class="fa fa-suitcase left"></i>Work Experience</h2>"""

for item in data["work"]:
    company = item["company"]
    position = item["position"]
    start = item["startDate"]
    end = item["endDate"]
    desc = item["description"]
    highlights = item["highlights"]

    html += "<section class=\"section-sub section-sub-job\">"
    # write job title
    html += f"<h3>{position}, {company}</h3>\n"

    # write start - end dates
    html += f"<h4>{start} - {end}</h4>\n"

    # write description
    html += f"<p>{desc}</p>\n"

    # write highlights
    html += "<ul>\n"
    for highlight in highlights:
        html += f"<li>{highlight}</li>\n"
    html += "</ul>\n"

    # end job section
    html += "</section>\n"

html += "</section>\n"
########### End work section

########### Begin skills section
html += """<section id="skills" class="section">
<h2><i class="fa fa-tasks left"></i>Skills</h2>"""

for category in data["skills"]:
    html += f"""<section class="section-sub section-sub-skill">
                    <h3 class="skills">{category['category']}</h3>
                    <ul class="list-set keywords">"""
    for skill in category["skills"]:
        html += f"<li>{skill}</li>\n"

    html += "</ul>\n</section>\n"

html += "</section>\n"
########### End skills section

########### Begin education section
html += """<section id="education" class="section">
<h2><i class="fa fa-graduation-cap left"></i>Education</h2>"""

for edu in data["education"]:
    html += f"""<section class="section-sub section-sub-education">
                    <h3>{edu['degree']} - {edu['school']}</h3>
                    <h4>{edu['start']} - {edu['end']}</h4>
                </section>"""

html += "</section>\n"
########### End education section

########### Begin awards section
html += """<section id="awards" class="section">
<h2><i class="fa fa-trophy left"></i>Awards</h2>"""

for award in data["awards"]:
    html += f"""<section class="section-sub section-sub-award">
                    <h3>{award['award']} - {award['organization']}</h3>
                    <h4>{award['date']}</h4>
                    <p>{award['description']}</p>
                </section>"""

html += "</section>\n"
########### End awards section

########### Add closing tags and stuff
html += """</main>
    </div>
    <script type="text/javascript" src="assets/resume.js"></script>
</body>

</html>"""

# Write to the html file
f = open("views/resume.html", "w")
f.write(html)
f.close()