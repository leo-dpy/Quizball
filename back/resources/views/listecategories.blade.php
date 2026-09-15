@extends('base')
@section('content')
@if (session('status'))
    <div class="alert alert-success">
        {{ session('status') }}
    </div>
@endif
<ul>
@foreach ($categories as $categorie)
    <li>{{$categorie->categorie}}</li>
@endforeach
</ul>