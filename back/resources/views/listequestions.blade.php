@extends('base')
@section('content')
@if (session('status'))
    <div class="alert alert-success">
        {{ session('status') }}
    </div>
@endif
<ul>
@foreach ($questions as $question)
    <li>{{$question->question}}</li>
@endforeach
</ul>