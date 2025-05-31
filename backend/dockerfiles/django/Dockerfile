FROM python:3.12-slim-bookworm AS builder
WORKDIR /app
ARG owner
ARG name
ARG gh_token
ARG branch
ARG commitHash
ARG dir
RUN apt update && apt install -y git
RUN git clone -b ${branch} https://${gh_token}@github.com/${owner}/${name}.git .
RUN git reset --hard ${commitHash}
WORKDIR /app/${dir}
COPY requirements.txt /app/requirements.txt
RUN pip install -r /app/requirements.txt

FROM python:3.12-slim-bookworm
WORKDIR /app
ARG owner
ARG name
ARG gh_token
ARG branch
ARG commitHash
ARG dir
RUN apt update && apt install -y git
RUN git clone -b ${branch} https://${gh_token}@github.com/${owner}/${name}.git .
RUN git reset --hard ${commitHash}
WORKDIR /app/${dir}
COPY --from=builder /usr/local/lib/python3.12/site-packages/ /usr/local/lib/python3.12/site-packages/
COPY --from=builder /usr/local/bin/ /usr/local/bin/
ENV PIP_ROOT_USER_ACTION=ignore
ENV TF_CPP_MIN_LOG_LEVEL=1
ENV PYTHONUNBUFFERED=1
ENV DONTWRITEBYTECODE=1
EXPOSE 3000
CMD ["python", "manage.py", "runserver"]